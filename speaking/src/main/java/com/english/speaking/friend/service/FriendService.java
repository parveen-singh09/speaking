package com.english.speaking.friend.service;

import com.english.speaking.chat.model.Message;
import com.english.speaking.chat.repository.MessageRepository;
import com.english.speaking.friend.dto.FriendResponse;
import com.english.speaking.friend.dto.UserSearchResult;
import com.english.speaking.friend.model.Friendship;
import com.english.speaking.friend.repository.FriendshipRepository;
import com.english.speaking.user.model.User;
import com.english.speaking.user.repository.UserRepository;
import com.english.speaking.ws.presence.PresenceService;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FriendService {

	private final FriendshipRepository friendships;
	private final UserRepository users;
	private final MessageRepository messages;
	private final PresenceService presence;

	public FriendService(FriendshipRepository friendships, UserRepository users,
			MessageRepository messages, PresenceService presence) {
		this.friendships = friendships;
		this.users = users;
		this.messages = messages;
		this.presence = presence;
	}

	@Transactional
	public void sendRequest(Long requesterId, Long addresseeId) {
		if (requesterId.equals(addresseeId)) {
			throw new IllegalArgumentException("Cannot friend yourself");
		}
		if (friendships.findByRequesterIdAndAddresseeId(requesterId, addresseeId).isPresent()
				|| friendships.findByRequesterIdAndAddresseeId(addresseeId, requesterId).isPresent()) {
			return;
		}
		Friendship f = new Friendship();
		f.setRequesterId(requesterId);
		f.setAddresseeId(addresseeId);
		f.setStatus("pending");
		friendships.save(f);
	}

	@Transactional
	public void accept(Long userId, Long friendshipId) {
		friendships.findById(friendshipId)
				.filter(f -> f.getAddresseeId().equals(userId) && "pending".equals(f.getStatus()))
				.ifPresent(f -> {
					f.setStatus("accepted");
					friendships.save(f);
				});
	}

	public List<FriendResponse> listFriends(Long userId) {
		return friendships.findAcceptedForUser(userId).stream()
				.map(f -> {
					Long otherId = f.getRequesterId().equals(userId)
							? f.getAddresseeId() : f.getRequesterId();
					return toFriendResponse(userId, f.getId(), otherId);
				})
				.filter(r -> r != null)
				.toList();
	}

	private FriendResponse toFriendResponse(Long userId, Long friendshipId, Long otherUserId) {
		User other = users.findById(otherUserId).orElse(null);
		if (other == null) {
			return null;
		}
		boolean online = presence.isOnline(otherUserId);
		long unread = messages.countBySenderIdAndRecipientIdAndReadAtIsNull(otherUserId, userId);
		List<Message> latest = messages.findLatestBetween(userId, otherUserId, PageRequest.of(0, 1));
		if (latest.isEmpty()) {
			return FriendResponse.of(friendshipId, other, online, null, false, unread);
		}
		Message m = latest.get(0);
		return FriendResponse.of(friendshipId, other, online, m.getBody(),
				m.getSenderId().equals(userId), unread);
	}

	public List<UserSearchResult> search(Long userId, String query, String location, String level) {
		String name = query != null && !query.isBlank() ? query.strip() : null;
		String loc = location != null && !location.isBlank() ? location.strip() : null;
		String lvl = level != null && !level.isBlank() ? level.strip() : null;
		if (name == null && loc == null && lvl == null) {
			return List.of();
		}
		return users.searchUsers(userId, name, loc, lvl, PageRequest.of(0, 20)).stream()
				.map(UserSearchResult::from)
				.toList();
	}

	public List<FriendResponse> listPending(Long userId) {
		return friendships.findByAddresseeIdAndStatus(userId, "pending").stream()
				.map(f -> toResponse(f.getId(), f.getRequesterId()))
				.filter(r -> r != null)
				.toList();
	}

	private FriendResponse toResponse(Long friendshipId, Long otherUserId) {
		return users.findById(otherUserId)
				.map(u -> FriendResponse.of(friendshipId, u))
				.orElse(null);
	}
}
