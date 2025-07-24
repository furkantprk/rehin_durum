package com.example.demo.service;

import com.example.demo.dto.KrediDTO;
import com.example.demo.entity.KrediBilgileriEntity;
import com.example.demo.id.KrediBilgileriId;
import com.example.demo.repository.KrediRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import'u kontrol et
import org.springframework.beans.BeanUtils; // Kopyalama için

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KrediService {

    private final KrediRepository krediRepository;

    public KrediService(KrediRepository krediRepository) {
        this.krediRepository = krediRepository;
    }

    private KrediDTO convertToDto(KrediBilgileriEntity entity) {
        KrediDTO dto = new KrediDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    private KrediBilgileriEntity convertToEntity(KrediDTO dto) {
        KrediBilgileriEntity entity = new KrediBilgileriEntity();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public KrediDTO getKrediBilgisiByKrediNoAndSira(String krediNo, Long sira) {
        KrediBilgileriId id = new KrediBilgileriId(krediNo, sira);
        Optional<KrediBilgileriEntity> entityOptional = krediRepository.findById(id);
        return entityOptional.map(this::convertToDto).orElse(null);
    }

    public List<KrediDTO> getKrediBilgileriByKrediNo(String krediNo) {
        List<KrediBilgileriEntity> entities = krediRepository.findByKrediNo(krediNo);
        return entities.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<KrediDTO> getAllKrediBilgileri() {
        List<KrediBilgileriEntity> entities = krediRepository.findAll();
        return entities.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional
    public KrediDTO createKrediBilgisi(KrediDTO krediDTO) {
        // Yeni bir SIRA numarası ataması gerekiyorsa burada yapılmalı.
        // Örneğin: krediDTO.setSira(krediRepository.findMaxSiraByKrediNo(krediDTO.getKrediNo()) + 1);
        KrediBilgileriEntity entity = convertToEntity(krediDTO);
        // Eğer veritabanı sequence veya identity ile sıra otomatik atıyorsa yukarıdaki satıra gerek kalmaz.
        KrediBilgileriEntity savedEntity = krediRepository.save(entity);
        return convertToDto(savedEntity);
    }

    @Transactional
    public KrediDTO updateKrediBilgisi(String krediNo, Long sira, KrediDTO krediDTO) {
        KrediBilgileriId id = new KrediBilgileriId(krediNo, sira);
        Optional<KrediBilgileriEntity> entityOptional = krediRepository.findById(id);

        if (entityOptional.isPresent()) {
            KrediBilgileriEntity existingEntity = entityOptional.get();
            // Burada tüm alanları DTO'dan Entity'ye kopyalıyoruz.
            // SIRA ve KREDI_NO'nun değişmemesi gerektiğini varsayıyoruz.
            BeanUtils.copyProperties(krediDTO, existingEntity, "krediNo", "sira"); // ID alanlarını kopyalama dışında tut

            KrediBilgileriEntity updatedEntity = krediRepository.save(existingEntity);
            return convertToDto(updatedEntity);
        }
        return null;
    }

    @Transactional
    public KrediDTO patchKrediBilgisi(String krediNo, Long sira, KrediDTO krediDTO) {
        KrediBilgileriId id = new KrediBilgileriId(krediNo, sira);
        Optional<KrediBilgileriEntity> entityOptional = krediRepository.findById(id);

        if (entityOptional.isPresent()) {
            KrediBilgileriEntity existingEntity = entityOptional.get();

            // Sadece DTO'da null olmayan (yani React'tan gelen) alanları güncelle
            if (krediDTO.getRehinDurumu() != null) {
                existingEntity.setRehinDurumu(krediDTO.getRehinDurumu());
            }
            // İleride başka alanlar eklenirse, benzer kontrollerle buraya eklenebilir.

            KrediBilgileriEntity patchedEntity = krediRepository.save(existingEntity); // Değişikliği veritabanına kaydet
            return convertToDto(patchedEntity);
        }
        return null; // Kayıt bulunamadı
    }

    @Transactional
    public boolean deleteKrediBilgisi(String krediNo, Long sira) {
        KrediBilgileriId id = new KrediBilgileriId(krediNo, sira);
        if (krediRepository.existsById(id)) {
            krediRepository.deleteById(id);
            return true;
        }
        return false;
    }
}