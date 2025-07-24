package com.example.demo.controller;

import com.example.demo.dto.KrediDTO;
import com.example.demo.service.KrediService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/kredi")
public class KrediController {

    private final KrediService krediService;

    public KrediController(KrediService krediService) {
        this.krediService = krediService;
    }

    @GetMapping("/tekil/{krediNo}/{sira}")
    public ResponseEntity<KrediDTO> getKrediBilgisiById(
            @PathVariable("krediNo") String krediNo,
            @PathVariable("sira") Long sira) {
        KrediDTO krediBilgisi = krediService.getKrediBilgisiByKrediNoAndSira(krediNo, sira);
        if (krediBilgisi != null) {
            return ResponseEntity.ok(krediBilgisi);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kredi bilgisi bulunamadı.");
        }
    }

    @GetMapping("/liste")
    public ResponseEntity<List<KrediDTO>> getKrediBilgileriByKrediNo(@RequestParam("krediNo") String krediNo) {
        List<KrediDTO> krediListesi = krediService.getKrediBilgileriByKrediNo(krediNo);
        if (!krediListesi.isEmpty()) {
            return ResponseEntity.ok(krediListesi);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/tum")
    public ResponseEntity<List<KrediDTO>> getAllKrediBilgileri() {
        List<KrediDTO> krediListesi = krediService.getAllKrediBilgileri();
        if (!krediListesi.isEmpty()) {
            return ResponseEntity.ok(krediListesi);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<KrediDTO> createKrediBilgisi(@RequestBody @Valid KrediDTO krediDTO) { // @Valid eklendi
        KrediDTO createdKredi = krediService.createKrediBilgisi(krediDTO);
        return new ResponseEntity<>(createdKredi, HttpStatus.CREATED);
    }

    @PutMapping("/{krediNo}/{sira}")
    public ResponseEntity<KrediDTO> updateKrediBilgisi(
            @PathVariable("krediNo") String krediNo,
            @PathVariable("sira") Long sira,
            @RequestBody @Valid KrediDTO krediDTO) { // @Valid eklendi

        KrediDTO updatedKredi = krediService.updateKrediBilgisi(krediNo, sira, krediDTO);
        if (updatedKredi != null) {
            return ResponseEntity.ok(updatedKredi);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Güncellenecek kredi bilgisi bulunamadı.");
        }
    }

    @PatchMapping("/{krediNo}/{sira}")
    public ResponseEntity<KrediDTO> patchKrediBilgisi(
            @PathVariable("krediNo") String krediNo,
            @PathVariable("sira") Long sira,
            @RequestBody KrediDTO krediDTO) { // Patch'te sadece değişen alanlar gelir, Valid'e genelde gerek kalmaz

        KrediDTO patchedKredi = krediService.patchKrediBilgisi(krediNo, sira, krediDTO);
        if (patchedKredi != null) {
            return ResponseEntity.ok(patchedKredi);
        } else {
            // Eğer servis null döndürürse, kaydın bulunamadığını belirt
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Güncellenecek kredi bilgisi bulunamadı.");
        }
    }

    @DeleteMapping("/{krediNo}/{sira}")
    public ResponseEntity<Void> deleteKrediBilgisi(
            @PathVariable("krediNo") String krediNo,
            @PathVariable("sira") Long sira) {

        boolean deleted = krediService.deleteKrediBilgisi(krediNo, sira);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Silinecek kredi bilgisi bulunamadı.");
        }
    }
}