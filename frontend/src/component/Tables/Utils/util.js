import dateTime from 'date-and-time';

export const dateformater = (date1) => {
    // console.log(date1);
    let date = new Date(date1)
    if(date){
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth()+1);
    let day = (date.getDate() ) > 9 ? date.getDate()  : '0' + date.getDate();
    return `${day}/${month}/${year}`
    }
    return null
  }


  export const dateParser = (dateString) => {
    return dateTime.parse(dateString);

  }