package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;

@Entity
@Table(name = "URUN_BILGILERI")
@IdClass(com.example.demo.id.KrediBilgileriId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"krediNo", "sira"})
@ToString
public class KrediBilgileriEntity implements Serializable {

    @Id
    @Column(name = "KREDI_NUMARASI")
    private String krediNo;

    @Id
    @Column(name = "SIRA")
    private Long sira;

    @Column(name = "REHIN_DURUM")
    private String rehinDurumu;
}