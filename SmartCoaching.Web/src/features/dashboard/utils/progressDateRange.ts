export const createLast30DaysRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
    };
};
