package com.example.demo.repository;

import com.example.demo.entity.KrediBilgileriEntity;
import com.example.demo.id.KrediBilgileriId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KrediRepository extends JpaRepository<KrediBilgileriEntity, KrediBilgileriId> {
    // Kredi numarasına göre kredi bilgilerini getiren özel metod
    List<KrediBilgileriEntity> findByKrediNo(String krediNo);
}