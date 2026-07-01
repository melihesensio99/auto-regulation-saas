type AthleteSectionKey = 'profile' | 'progress' | 'workout' | 'diet' | 'targets';

interface AthleteSectionSidebarProps {
    activeSection: AthleteSectionKey;
    onSelect: (section: AthleteSectionKey) => void;
}

const sections: Array<{
    key: AthleteSectionKey;
    label: string;
    description: string;
}> = [
    {
        key: 'profile',
        label: 'Profil',
        description: 'Temel bilgiler, baslangic verileri ve kisisel detaylar',
    },
    {
        key: 'progress',
        label: 'Gelisim',
        description: 'Gunluk loglar, kilo takibi ve haftalik akis',
    },
    {
        key: 'workout',
        label: 'Antrenman',
        description: 'Gun bazli plan, hareketler ve uygulama notlari',
    },
    {
        key: 'diet',
        label: 'Beslenme',
        description: 'Ogün yapisi, toplam degerler ve genel plan notu',
    },
    {
        key: 'targets',
        label: 'Hedefler',
        description: 'Kalori, adim ve gunluk uyum ilerlemesi',
    },
];

export const AthleteSectionSidebar = ({
    activeSection,
    onSelect,
}: AthleteSectionSidebarProps) => {
    return (
        <aside className="athlete-detail-shell__sidebar">
            <div className="athlete-detail-shell__sidebar-header">
                <span className="section-label">ATHLETE SECTIONS</span>
                <h3>Kisisel menu</h3>
                <p>Bir alan sec, ekranda sadece o bolum kalsin.</p>
            </div>

            <div className="athlete-detail-shell__nav">
                {sections.map((section) => (
                    <button
                        key={section.key}
                        type="button"
                        className={`athlete-detail-shell__nav-item ${activeSection === section.key ? 'is-active' : ''}`}
                        onClick={() => onSelect(section.key)}
                    >
                        <strong>{section.label}</strong>
                        <span>{section.description}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export type { AthleteSectionKey };
