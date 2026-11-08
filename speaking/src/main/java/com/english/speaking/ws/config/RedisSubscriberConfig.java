package com.english.speaking.ws.config;

import com.english.speaking.ws.handler.SignalingSubscriber;
import com.english.speaking.ws.router.MessageRouter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Configuration
public class RedisSubscriberConfig {

	@Bean
	RedisMessageListenerContainer signalingListenerContainer(
			RedisConnectionFactory connectionFactory, SignalingSubscriber subscriber) {
		var container = new RedisMessageListenerContainer();
		container.setConnectionFactory(connectionFactory);
		container.addMessageListener(subscriber, new ChannelTopic(MessageRouter.CHANNEL));
		return container;
	}
}
