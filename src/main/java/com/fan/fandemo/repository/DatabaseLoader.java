package com.fan.fandemo.repository;

import com.fan.fandemo.entity.FanSettings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DatabaseLoader implements CommandLineRunner {
    @Value("${test_param}")
    private String testParam;
    
    private FanSettingsRepository fanSettingsRepository;
    
    public DatabaseLoader(FanSettingsRepository repository) {
        this.fanSettingsRepository =repository;
    }
    
    @Override
    public void run(String... strings) throws Exception {
        log.info("test_param={}", testParam);
        
        String defaultSettingName ="default";
        FanSettings fan_settings =fanSettingsRepository.findByName(defaultSettingName);
        
        if(fan_settings == null) {
            log.info("run: fan_settings.name={} not found in DB table fan_settings. Create one.", defaultSettingName);

            // create a new record of fan_settings with the given name, and default values.
            fan_settings =new FanSettings();
            fan_settings.setName(defaultSettingName);
            fan_settings.setSpeed(0L);
            fan_settings.setDirection(0L);

            fanSettingsRepository.save(fan_settings);
        }

    }
}
