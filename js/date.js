function getCurrentDate() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wedneday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 
        'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];
    
    const date = new Date();
    const currentDayOfWeek = daysOfWeek[date.getDay()];
    const currentMonth = months[date.getMonth()];
    const currentDay = date.getDate();

    const formattedDate = `${currentDayOfWeek} ${currentMonth} ${currentDay}`;
    document.querySelector("#display-date").textContent = formattedDate;
}

getCurrentDate();