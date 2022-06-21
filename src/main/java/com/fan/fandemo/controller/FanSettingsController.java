package com.fan.fandemo.controller;

import com.fan.fandemo.entity.FanSettings;
import com.fan.fandemo.service.FanSettingsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fansettings")
@Slf4j
public class FanSettingsController {
    
    @Autowired
    private FanSettingsService fanSettingsService;
    
    @PostMapping("/")
    public FanSettings save(@RequestBody FanSettings fanSettings) {
        log.info("save: {}", fanSettings);
        return fanSettingsService.save(fanSettings);
    }
    
    @GetMapping("/{id}")
    public FanSettings findById(@PathVariable("id") Long id) {
        log.info("findById: id={}", id);
        return fanSettingsService.findById(id);
    }

    @GetMapping("/")
    public FanSettings findByName(@RequestParam("name") String name) {
        log.info("findByName: name={}", name);
        return fanSettingsService.findByName(name);
    }
}
