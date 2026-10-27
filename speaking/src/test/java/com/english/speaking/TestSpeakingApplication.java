package com.english.speaking;

import org.springframework.boot.SpringApplication;

public class TestSpeakingApplication {

	public static void main(String[] args) {
		SpringApplication.from(SpeakingApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
