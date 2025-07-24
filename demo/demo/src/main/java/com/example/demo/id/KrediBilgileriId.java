package com.example.demo.id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KrediBilgileriId implements Serializable {

    private String krediNo;
    private Long sira;
}
