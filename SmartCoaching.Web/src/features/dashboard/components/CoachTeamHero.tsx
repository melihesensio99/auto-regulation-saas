export const CoachTeamHero = () => {
    return (
        <section className="coach-hero surface">
            <div className="coach-hero__grid">
                <div className="card-stack">
                    <span className="eyebrow">Team overview</span>
                    <div>
                        <h2 className="page-title" style={{ fontSize: '2.5rem' }}>
                            Takimin bugunu nasil?
                        </h2>
                        <p className="page-subtitle" style={{ marginTop: 12 }}>
                            Sadece kritik ozetler ve dikkat edilmesi gereken sporcular.
                        </p>
                    </div>
                    <div className="pill-group">
                        <span className="chip chip--success">Bugun aktif</span>
                        <span className="chip">Eksik program</span>
                        <span className="chip">Kayit takibi</span>
                    </div>
                </div>

                <div className="timeline-card" style={{ padding: 18 }}>
                    <span className="section-label">Dashboard mantigi</span>
                    <p style={{ marginTop: 10 }}>
                        Bu ekran artik sadece ozet verir: kac sporcu var, bugun kim aktif ve kim takip istiyor.
                        Detaylar secilen sporcunun sayfalarinda acilir.
                    </p>
                </div>
            </div>
        </section>
    );
};
