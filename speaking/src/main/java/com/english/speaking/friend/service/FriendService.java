package com.english.speaking.friend.service;

import com.english.speaking.friend.dto.FriendResponse;
import com.english.speaking.friend.model.Friendship;
import com.english.speaking.friend.repository.FriendshipRepository;
import com.english.speaking.user.model.User;
import com.english.speaking.user.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FriendService {

	private final FriendshipRepository friendships;
	private final UserRepository users;

	public FriendService(FriendshipRepository friendships, UserRepository users) {
		this.friendships = friendships;
		this.users = users;
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
					return toResponse(f.getId(), otherId);
				})
				.filter(r -> r != null)
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
