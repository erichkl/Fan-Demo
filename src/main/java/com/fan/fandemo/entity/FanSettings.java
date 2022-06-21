package com.fan.fandemo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FanSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long fanSettingsId;
    
    @Column(unique = true)
    private String name;
    
    private Long speed;
    
    // 0:normal, 1:reversed
    private Long direction;
    
}
