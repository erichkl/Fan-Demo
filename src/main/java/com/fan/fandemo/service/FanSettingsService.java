package com.fan.fandemo.service;

import com.fan.fandemo.entity.FanSettings;
import com.fan.fandemo.repository.FanSettingsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FanSettingsService {
    @Autowired
    private FanSettingsRepository fanSettingsRepository;

    public FanSettings save(FanSettings fanSettings) {
        log.info("FanSettingsService.save:");
        return fanSettingsRepository.save(fanSettings);
    }

    public FanSettings findById(Long id) {
        log.info("findById: id={}", id);
        return fanSettingsRepository.findByFanSettingsId(id);
    }

    public FanSettings findByName(String name) {
        log.info("findByName: name={}", name);
        FanSettings fan_settings =fanSettingsRepository.findByName(name);
        return fan_settings;
    }
}
