package com.fan.fandemo.repository;

import com.fan.fandemo.entity.FanSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FanSettingsRepository extends JpaRepository<FanSettings, Long> {
    FanSettings findByFanSettingsId(Long id);
    FanSettings findByName(String name);
}
