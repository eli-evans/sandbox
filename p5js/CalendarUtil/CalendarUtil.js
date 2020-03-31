// Note this is mostly just hacks to show what info is needed
// to draw the ring for one year

class CalendarUtil {

    static getChurchHolidays2020() {
      return [
        {start: "January 6", name: "Ephiphany"},
        {start: "February 14", name: "St. Valentine's Day"},
        {start: "February 26", name: "Ash Wednesday"},
        {start: "March 17", name: "St. Patrick's Day"},
        {start: "March 25", name: "Annunciation Sunday"},
        {start: "April 5", name: "Palm Sunday"},
        {start: "April 6", name: "Holy Monday"},
        {start: "April 7", name: "Holy Tuesday"},
        {start: "April 8", name: "Holy Wednesday"},
        {start: "April 9", name: "Maundy Thursday"},
        {start: "April 10", name: "Good Friday"},
        {start: "April 11", name: "Easter Vigil"},
        {start: "April 12", name: "Easter"},
        {start: "May 21", name: "Ascension Day"},
        {start: "May 31", name: "Pentecost"},
        {start: "October 31", name: "All Saints Vigil / Reformation Day"},
        {start: "November 1", name: "All Saints Day"},
        {start: "November 26", name: "Thanksgiving"},
      ];
    }

    static getUSHolidays2020() {
        return [
            {start: "January 1", name: "New Year's Day"},
            {start: "January 20", name: "Martin Luther Ling, Jr. Day"},
            
            {start: "February 17", name: "President's Day"},


            {start: "May 25", name: "Memorial Day"},
            {start: "July 3", name: "Independence Day (Observed)"},
            {start: "July 4", name: "Independence Day"},
            {start: "September 7", name: "Labor Day"},
            {start: "November 11", name: "Columbus Day"},
            {start: "December 25", name: "Christmas Day"},
            {start: "December 31", name: "New Year's Eve"},
        ];
    }

    static get2020() {

        var ret = {};

        // This is hard-coded but could be calculated (I was just lazy)
        ret.months = [
            {name: "January", abbr: "JAN", length: 31, sundays: [5, 12, 19, 26]},
            {name: "February", abbr: "FEB", length: 29, sundays: [2, 9, 16, 23]},
            {name: "March", abbr: "MAR", length: 31, sundays: [1, 8, 15, 22, 29]},
            {name: "April", abbr: "APR", length: 30, sundays: [5, 12, 19, 26]},
            {name: "May", abbr: "MAY", length: 31, sundays: [3, 10, 17, 24, 31]},
            {name: "June", abbr: "JUN", length: 30, sundays: [7, 14, 21, 28]},
            {name: "July", abbr: "JUL", length: 31, sundays: [5, 12, 19, 26]},
            {name: "August", abbr: "AUG", length: 31, sundays: [2, 9, 16, 23, 30]},
            {name: "September", abbr: "SEP", length: 30, sundays: [6, 13, 20, 27]},
            {name: "October", abbr: "OCT", length: 31, sundays: [4, 11, 18, 25]},
            {name: "November", abbr: "NOV", length: 30, sundays: [1, 8, 15, 22, 29]},
            {name: "December", abbr: "DEC", length: 31, sundays: [6, 13, 20, 27]},
          ];

          // dictionary of days to degree positions
          ret.daysByName = {};
          ret.days = [];

          // count the total number of days
          // should be 365, or 366 in leap years
          var nDays = 0;
          ret.months.forEach( m => {
            nDays += m.length;
          });

          // the width of one day, in degrees
          ret.degreesPerDay = 360/nDays;

          // cycle days and set position on the wheel
          var nDay = 0;
          ret.months.forEach( m => {
            m.days = [];
            for (var n = 1; n <= m.length; ++n) {
                ++nDay;
                var name = m.name + " " + n;
                var day = {name: name, index: nDay, position: (nDay-1) * ret.degreesPerDay};
                ret.daysByName[name] = day;
                ret.days.push(day);
                m.days.push(day);
            }
          });

          // count the number of full 7-day weeks
          ret.fullWeeks = 0;
          ret.months.forEach( m => {
            ret.fullWeeks += m.sundays.length;
          });

          // how long are the first and last week?
          ret.firstWeekLength = ret.months[0].sundays[0] - 1;
          ret.lastWeekLength = 31 - ret.months[11].sundays[ ret.months[11].sundays.length - 1 ] + 1;

          if (ret.lastWeekLength != 7) {
            ret.fullWeeks -= 1; // back off partial week at the end
          }

        return ret;
    }

}

