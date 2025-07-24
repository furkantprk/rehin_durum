package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KrediDTO {

    @NotBlank(message = "Kredi Numarası boş olamaz")
    @Size(min = 1, max = 50, message = "Kredi Numarası 1 ile 50 karakter arasında olmalı")
    private String krediNo;

    @NotNull(message = "Sıra boş olamaz")
    private Long sira;

    @Size(max = 1, message = "Rehin Durumu en fazla 1 karakter olmalı")
    private String rehinDurumu;

    @Override
    public String toString() {
        return "KrediDTO{" +
                "krediNo='" + krediNo + '\'' +
                ", sira=" + sira +
                ", rehinDurumu='" + rehinDurumu + '\'' +
                '}';
    }
}