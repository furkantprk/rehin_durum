import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Stil dosyamız

function App() {
    // Kredi numarası girişi için state
    const [krediNo, setKrediNo] = useState('');
    // Kullanıcıya gösterilecek mesaj (başarı/hata)
    const [message, setMessage] = useState('');
    // API isteği devam ederken loading durumu
    const [loading, setLoading] = useState(false);
    // Kredi numarasına göre çekilen kredi bilgilerini tutan liste
    const [krediBilgileri, setKrediBilgileri] = useState([]);
    // Güncelleme yaparken hangi SIRA'nın güncelleneceğini belirtmek için seçili sıra state'i
    const [selectedSira, setSelectedSira] = useState(''); // 'all' değeri de alabilir
    // Yeni rehin durumu seçimi için state
    const [newRehinDurumu, setNewRehinDurumu] = useState(''); // Başlangıçta boş

    // Rehin durumu seçenekleri ve açıklamaları
    const rehinDurumuOptions = [
        { value: '1', label: '1- Kesin Rehin' },
        { value: '2', label: '2- Ön Rehin' },
        { value: '3', label: '3- Ön Rehin Sonrası Kesin Rehin' },
        { value: '4', label: '4- Kesin Rehin Konulmadı' },
        { value: '5', label: '5- Ön Rehin Konulmadı/Ruhsat Çıkmış' },
        { value: '6', label: '6- Ön Rehin Kesin Rehine Dönmedi' },
        { value: '7', label: '7- Manuel Rehin (Eski)' },
        { value: '8', label: '8- Manuel Rehin' },
        { value: '9', label: '9- Manuel Rehin (Yeni)' },
        { value: '10', label: '10- Manuel Rehin (EGM)' },
        { value: '11', label: '11- Daha Sonra OR Yapılacak' },
        { value: '12', label: '12- Daha Sonra KR Yapılacak' },
        { value: '13', label: '13- Kısmi Ödeme Ön Rehin İptal' },
        { value: '14', label: '14- Ön Rehin Konulmadı/Araç Bilgileri Doğrulanmadı' },
        { value: '15', label: '15- Rehin Kaldırıldı - KT Öncesi' },
        { value: '16', label: '16- Rehin Kaldırıldı - İcra Satışı' },
        { value: '17', label: '17- Müsadere Edildi' },
        { value: '20', label: '20- Rehin Kaldırıldı' },
    ];

    // Sayısal rehin durumunu açıklama metnine çeviren yardımcı fonksiyon
    const getRehinDurumuLabel = (value) => {
        const option = rehinDurumuOptions.find(opt => opt.value === value);
        return option ? option.label : (value !== null ? value : 'Boş');
    };

    // Kredi Numarası girişi değiştikçe state'i güncelleyen fonksiyon
    const handleKrediNoChange = (event) => {
        setKrediNo(event.target.value);
        setMessage(''); // Yeni numara girince mesajı temizle
        setKrediBilgileri([]); // Yeni numara girince listeyi temizle
        setSelectedSira(''); // Yeni numara girince seçili sırayı temizle
        setNewRehinDurumu(''); // Yeni numara girince yeni rehin durumunu temizle
    };

    // Kredi Numarasına göre bilgileri getirme fonksiyonu
    const fetchKrediBilgileri = async () => {
        if (!krediNo) {
            setMessage('Lütfen bir kredi numarası girin.');
            return;
        }

        setLoading(true);
        setMessage('');
        setNewRehinDurumu(''); // Yeni aramadan önce yeni rehin durumunu temizle

        try {
            const response = await axios.get(`http://localhost:8080/api/kredi/liste?krediNo=${krediNo}`);

            if (response.status === 200) {
                setKrediBilgileri(response.data);
                setMessage('Kredi bilgileri başarıyla getirildi.');

                // Eğer daha önce bir sıra seçiliyse ve yeni gelen veride varsa onu koru
                // Eğer "Tümünü Seç" seçiliyse de koru
                if (selectedSira === 'all') {
                    // "Tümünü Seç" zaten seçiliyse değiştirmeyin
                } else {
                    const previousSelectedSiraExists = response.data.some(kredi => kredi.sira === selectedSira);
                    if (!previousSelectedSiraExists && response.data.length > 0) {
                        setSelectedSira(response.data[0].sira);
                        setNewRehinDurumu(response.data[0].rehinDurumu || '');
                    } else if (selectedSira && previousSelectedSiraExists) {
                        // Mevcut selectedSira'nın rehin durumunu güncelle
                        const currentSelectedKredi = response.data.find(kredi => kredi.sira === selectedSira);
                        if (currentSelectedKredi) {
                            setNewRehinDurumu(currentSelectedKredi.rehinDurumu || '');
                        }
                    } else if (response.data.length === 0) {
                        // Hiç kayıt gelmezse seçili sırayı temizle
                        setSelectedSira('');
                        setNewRehinDurumu('');
                    }
                }

            } else if (response.status === 204) {
                setMessage('Bu kredi numarasına ait kayıt bulunamadı.');
                setKrediBilgileri([]); // Kayıt bulunamazsa listeyi temizle
                setSelectedSira('');
                setNewRehinDurumu('');
            }
        } catch (error) {
            console.error('Kredi bilgileri alınırken hata oluştu:', error);
            if (error.response) {
                setMessage(`Hata (${error.response.status}): ${error.response.data.message || 'API hatası.'}`);
            } else if (error.request) {
                setMessage('Sunucuya ulaşılamadı. Spring Boot uygulamanız çalışıyor mu? CORS ayarlarını kontrol edin.');
            } else {
                setMessage('İstek kurulurken bir hata oluştu.');
            }
            setKrediBilgileri([]); // Hata durumunda listeyi temizle
            setSelectedSira('');
            setNewRehinDurumu('');
        } finally {
            setLoading(false);
        }
    };

    // SIRA seçimi değiştikçe state'i güncelleyen fonksiyon
    const handleSiraChange = (event) => {
        const value = event.target.value;
        // 'all' string olarak saklanacak, diğerleri Number'a çevrilecek
        setSelectedSira(value === 'all' ? 'all' : Number(value));
        // Eğer 'all' seçilirse, newRehinDurumu'nu temizle
        if (value === 'all') {
            setNewRehinDurumu('');
        } else {
            // Seçilen sıraya ait rehin durumunu combo box'a yansıt
            const selectedKredi = krediBilgileri.find(k => k.sira === Number(value));
            setNewRehinDurumu(selectedKredi ? (selectedKredi.rehinDurumu || '') : '');
        }
    };

    // Yeni rehin durumu seçimi değiştikçe state'i güncelleyen fonksiyon
    const handleNewRehinDurumuChange = (event) => {
        setNewRehinDurumu(event.target.value);
    };

    // Rehin Durumu Güncelleme Fonksiyonu
    const updateRehinDurumu = async () => {
        if (!krediNo || (!selectedSira && krediBilgileri.length > 0)) { // Eğer kayıtlar varsa ama sıra seçilmemişse
            setMessage('Lütfen kredi numarası ve güncellenecek sıra seçin.');
            return;
        }
        if (!newRehinDurumu) {
            setMessage('Lütfen yeni rehin durumunu seçin.');
            return;
        }

        setLoading(true);
        setMessage('');
        let updatedCount = 0;
        let success = true;

        try {
            if (selectedSira === 'all') {
                // Bütün sıraları güncelle
                for (const kredi of krediBilgileri) {
                    try {
                        await axios.patch(
                            `http://localhost:8080/api/kredi/${krediNo}/${kredi.sira}`,
                            { rehinDurumu: newRehinDurumu }
                        );
                        updatedCount++;
                    } catch (error) {
                        console.error(`Kredi No: ${krediNo}, Sıra: ${kredi.sira} güncellenirken hata:`, error);
                        success = false; // Bir hata olursa genel işlemi başarısız say
                    }
                }
                if (success) {
                    setMessage(`${updatedCount} adet kaydın rehin durumu başarıyla güncellendi. Yeni Durum: ${getRehinDurumuLabel(newRehinDurumu)}`);
                } else {
                    setMessage(`Rehin durumu güncellenirken bazı hatalar oluştu. ${updatedCount} kayıt güncellendi.`);
                }

            } else {
                // Tekil sırayı güncelle
                const response = await axios.patch(
                    `http://localhost:8080/api/kredi/${krediNo}/${selectedSira}`,
                    { rehinDurumu: newRehinDurumu }
                );

                if (response.status === 200) {
                    setMessage(`Rehin durumu başarıyla güncellendi: Kredi No: ${krediNo}, Sıra: ${selectedSira}, Yeni Durum: ${getRehinDurumuLabel(newRehinDurumu)}`);
                    updatedCount = 1;
                }
            }
            fetchKrediBilgileri(); // Güncelleme sonrası listeyi yeniden çek
        } catch (error) {
            console.error('Rehin durumu güncellenirken genel hata oluştu:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    setMessage(`Hata: Kredi No: ${krediNo}, Sıra: ${selectedSira} için kayıt bulunamadı.`);
                } else {
                    setMessage(`Hata (${error.response.status}): ${error.response.data.message || 'API hatası.'}`);
                }
            } else {
                setMessage('API ile iletişim kurulurken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Kredi Rehin Yönetimi</h1>

            <div className="input-section">
                <label htmlFor="krediNoInput">Kredi Numarası:</label>
                <input
                    type="text"
                    id="krediNoInput"
                    value={krediNo}
                    onChange={handleKrediNoChange}
                    placeholder="Kredi Numarasını Girin"
                    disabled={loading}
                />
                <button onClick={fetchKrediBilgileri} disabled={loading || !krediNo}>
                    Kredi Bilgilerini Getir
                </button>
            </div>

            {message && (
                <p className={`message ${message.startsWith('Hata') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            {loading && <p className="loading">İşlem devam ediyor...</p>}

            {krediBilgileri.length > 0 && (
                <div className="kredi-list-section">
                    <h2>Kredi Detayları ({krediNo})</h2>
                    <div className="sira-select-container">
                        <label htmlFor="siraSelect">Güncellenecek Sıra:</label>
                        <select
                            id="siraSelect"
                            value={selectedSira}
                            onChange={handleSiraChange}
                            disabled={loading}
                        >
                            <option value="">Bir Sıra Seçin</option>
                            {krediBilgileri.length > 0 && ( // Kayıt varsa "Tümünü Seç" seçeneğini göster
                                <option value="all">Tümünü Seç</option>
                            )}
                            {krediBilgileri.map((kredi) => (
                                <option key={kredi.sira} value={kredi.sira}>
                                    {kredi.sira} (Mevcut Durum: {getRehinDurumuLabel(kredi.rehinDurumu)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {(selectedSira || krediBilgileri.length > 0) && (
                        <div className="update-section">
                            <label htmlFor="newRehinDurumuSelect">Yeni Rehin Durumu:</label>
                            <select
                                id="newRehinDurumuSelect"
                                value={newRehinDurumu}
                                onChange={handleNewRehinDurumuChange}
                                disabled={loading}
                            >
                                <option value="">Seçiniz</option>
                                {rehinDurumuOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="button-green"
                                onClick={updateRehinDurumu}
                                disabled={loading || !newRehinDurumu || (!selectedSira && krediBilgileri.length > 0)}
                            >
                                Rehin Durumunu Güncelle
                            </button>
                        </div>
                    )}

                    <div className="all-kredi-items">
                        <h3>Tüm Kayıtlar</h3>
                        {krediBilgileri.map((kredi) => (
                            <div key={`${kredi.krediNo}-${kredi.sira}`} className="kredi-item">
                                <p><strong>Sıra:</strong> {kredi.sira}</p>
                                {/* Rehin durumu null ise "Boş" yazalım */}
                                <p><strong>Mevcut Durum:</strong> {getRehinDurumuLabel(kredi.rehinDurumu)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;