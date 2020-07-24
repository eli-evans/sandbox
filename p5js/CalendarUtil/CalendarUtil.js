// Note this is mostly just hacks to show what info is needed
// to draw the ring for one year

class CalendarUtil {

	static getCatholicSeasons2020() {
		// The liturgical year starts in Advent, so these are actually the previous year
		return [
			{ start: "December 1, 2019", end: "December 23, 2019", name: "Advent", color: "purple", type: "series" },
			{ start: "December 24, 2019", end: "January 12, 2020", name: "Christmas", color: "yellow", type: "series" },

			{ start: "January 13, 2020", end: "February 25, 2020", name: "Ephiphany", color: "green", type: "series" },
			{ start: "February 26, 2020", end: "April 7, 2020", name: "Lent", color: "purple", type: "series" },
			{ start: "April 8, 2020", end: "April 12, 2020", name: "Triduum", color: "white", type: "series"},
			{ start: "April 13, 2020", end: "May 31, 2020", name: "Easter", color: "yellow", type: "series" },
			{ start: "June 1, 2020", end: "November 28, 2020", name: "Ordinary Time", color: "green", type: "series" },
 		];		
	}

	static getCatholicSundayCycle2020() {
		return [
			// Advent 2019
			{ name: "First Week of Advent", start: "December 1, 2019", end: "December 1, 2019", color: "purple" },
			{ name: "Second Week of Advent", start: "December 8, 2019", end: "December 8, 2019", color: "purple" },
			{ name: "Third Week of Advent", start: "December 15, 2019", end: "December 15, 2019", color: "purple" },
			{ name: "Fourth Week of Advent", start: "December 22, 2019", end: "December 22, 2019", color: "purple" },

		   // Christmas 2019
			{ name: "Nativity of the Lord", start: "December 24, 2019", end: "December 25, 2019", color: "yellow" },
			{ name: "Holy Family of Jesus, Mary and Joseph", start: "December 29, 2019", end: "December 29, 2019", color: "yellow" },
			{ name: "Solemnity of Mary, the Holy Mother of God", start: "January 1, 2020", end: "January 1, 2020", color: "yellow" },
			{ name: "Epiphany of the Lord", start: "January 5, 2020", end: "January 5, 2020", color: "yellow" },

		   // Epiphany
		   { name: "Baptism of the Lord", start: "January 12, 2020", end: "January 12, 2020", color: "yellow" },
		   { name: "Second Sunday in Ordinary Time", start: "January 19, 2020", end: "January 19, 2020", color: "green" },
		   { name: "Third Sunday in Ordinary Time", start: "January 26, 2020", end: "January 26, 2020", color: "green" },
		   { name: "Presentation of the Lord", start: "February 2, 2020", end: "February 2, 2020", color: "green" },
		   { name: "Fifth Sunday in Ordinary Time", start: "February 9, 2020", end: "February 9, 2020", color: "green" },
		   { name: "Sixth Sunday in Ordinary Time", start: "February 16, 2020", end: "February 16, 2020", color: "green" },
		   { name: "Transfiguration Sunday", start: "February 23, 2020", end: "February 23, 2020", color: "yellow" },

		   // Lent
		   { name: "Ash Wednesday", start: "February 26, 2020", end: "February 26, 2020", color: "purple" },
		   { name: "First Sunday in Lent", start: "March 1, 2020", end: "March 1, 2020", color: "purple" },
		   { name: "Second Sunday in Lent", start: "March 8, 2020", end: "March 8, 2020", color: "purple" },
		   { name: "Third Sunday in Lent", start: "March 15, 2020", end: "March 15, 2020", color: "purple" },
		   { name: "Fourth Sunday in Lent", start: "March 22, 2020", end: "March 22, 2020", color: "purple" },
		   { name: "Annunciation of the Lord", start: "March 25, 2020", end: "March 25, 2020", color: "yellow" },
		   { name: "Fifth Sunday in Lent", start: "March 29, 2020", end: "March 29, 2020", color: "purple" },
		   { name: "Palm Sunday or Passion Sunday", start: "April 5, 2020", end: "April 5, 2020", color: "purple" },

		   // Holy Week
		   { name: "Holy Monday", start: "April 6, 2020", end: "April 6, 2020", color: "purple" },
		   { name: "Holy Tuesday", start: "April 7, 2020", end: "April 7, 2020", color: "purple" },
		   { name: "Holy Wednesday", start: "April 8, 2020", end: "April 8, 2020", color: "purple" },
		   { name: "Holy Thursday", start: "April 9, 2020", end: "April 9, 2020", color: "purple" },
		   { name: "Holy Friday", start: "April 10, 2020", end: "April 10, 2020", color: "purple" },
		   { name: "Holy Saturday", start: "April 11, 2020", end: "April 11, 2020", color: "purple" },

		   // Easter
		   { name: "Resurrection of the Lord", start: "April 12, 2020", end: "April 12, 2020", color: "yellow" },
		   { name: "Easter Evening", start: "April 12, 2020", end: "April 12, 2020", color: "yellow" },
		   { name: "Second Sunday of Easter", start: "April 19, 2020", end: "April 19, 2020", color: "yellow" },
		   { name: "Third Sunday of Easter", start: "April 26, 2020", end: "April 26, 2020", color: "yellow" },
		   { name: "Fourth Sunday of Easter", start: "May 3, 2020", end: "May 3, 2020", color: "yellow" },
		   { name: "Fifth Sunday of Easter", start: "May 10, 2020", end: "May 10, 2020", color: "yellow" },
		   { name: "Sixth Sunday of Easter", start: "May 17, 2020", end: "May 17, 2020", color: "yellow" },
		   { name: "Ascension of the Lord", start: "May 21, 2020", end: "May 21, 2020", color: "yellow" },
		   { name: "Seventh Sunday of Easter", start: "May 24, 2020", end: "May 24, 2020", color: "yellow" },
		   { name: "Visitation of Mary to Elizabeth", start: "May 31, 2020", end: "May 31, 2020", color: "yellow" },
		   { name: "Day of Pentecost", start: "May 31, 2020", end: "May 31, 2020", color: "red" },

		   // After Pentecost
		   { name: "Trinity Sunday", start: "June 7, 2020", end: "June 7, 2020", color: "yellow" },
		   { name: "Proper 6 (11)", start: "June 14, 2020", end: "June 14, 2020", color: "green" },
		   { name: "Proper 7 (12)", start: "June 21, 2020", end: "June 21, 2020", color: "green" },
		   { name: "Proper 8 (13)", start: "June 28, 2020", end: "June 28, 2020", color: "green" },
		   { name: "Proper 9 (14)", start: "July 5, 2020", end: "July 5, 2020", color: "green" },
		   { name: "Proper 10 (15)", start: "July 12, 2020", end: "July 12, 2020", color: "green" },
		   { name: "Proper 11 (16)", start: "July 19, 2020", end: "July 19, 2020", color: "green" },
		   { name: "Proper 12 (17)", start: "July 26, 2020", end: "July 26, 2020", color: "green" },
		   { name: "Proper 13 (18)", start: "August 2, 2020", end: "August 2, 2020", color: "green" },
		   { name: "Proper 14 (19)", start: "August 9, 2020", end: "August 9, 2020", color: "green" },
		   { name: "Proper 15 (20)", start: "August 16, 2020", end: "August 16, 2020", color: "green" },
		   { name: "Proper 16 (21)", start: "August 23, 2020", end: "August 23, 2020", color: "green" },
		   { name: "Proper 17 (22)", start: "August 30, 2020", end: "August 30, 2020", color: "green" },
		   { name: "Proper 18 (23)", start: "September 6, 2020", end: "September 6, 2020", color: "green" },
		   { name: "Proper 19 (24)", start: "September 13, 2020", end: "September 13, 2020", color: "green" },
		   { name: "Holy Cross", start: "September 14, 2020", end: "September 14, 2020", color: "red" },
		   { name: "Proper 20 (25)", start: "September 20, 2020", end: "September 20, 2020", color: "green" },
		   { name: "Proper 21 (26)", start: "September 27, 2020", end: "September 27, 2020", color: "green" },
		   { name: "Proper 22 (27)", start: "October 4, 2020", end: "October 4, 2020", color: "green" },
		   { name: "Proper 23 (28)", start: "October 11, 2020", end: "October 11, 2020", color: "green" },
		   { name: "Canadian Thanksgiving Day", start: "October 12, 2020", end: "October 12, 2020", color: "green" },
		   { name: "Proper 24 (29)", start: "October 18, 2020", end: "October 18, 2020", color: "green" },
		   { name: "Proper 25 (30)", start: "October 25, 2020", end: "October 25, 2020", color: "green" },
		   { name: "Proper 26 (31)", start: "November 1, 2020", end: "November 1, 2020", color: "green" },
		   { name: "All Saints Day", start: "November 1, 2020", end: "November 1, 2020", color: "green" },
		   { name: "Proper 27 (32)", start: "November 8, 2020", end: "November 8, 2020", color: "green" },
		   { name: "Proper 28 (33)", start: "November 15, 2020", end: "November 15, 2020", color: "green" },
		   { name: "Reign of Christ - Proper 29 (34)", start: "November 22, 2020", end: "November 22, 2020", color: "yellow" },
		   { name: "Thanksgiving Day, USA", start: "November 26, 2020", end: "November 26, 2020", color: "green" },
		];		
	}

	static getRCLSeasons2020() {
		// The liturgical year starts in Advent, so these are actually the previous year
		return [
			{ start: "December 1, 2019", end: "December 23, 2019", name: "Advent", color: "purple", type: "series" },
			{ start: "December 24, 2019", end: "January 5, 2020", name: "Christmas", color: "yellow", type: "series" },

			{ start: "January 6, 2020", end: "February 25, 2020", name: "Ephiphany", color: "green", type: "series" },
			{ start: "February 26, 2020", end: "April 11, 2020", name: "Lent", color: "purple", type: "series" },
			{ start: "April 12, 2020", end: "June 6, 2020", name: "Easter", color: "yellow", type: "series" },
			{ start: "June 7, 2020", end: "November 28, 2020", name: "After Pentecost", color: "green", type: "series" },
 		];
	}

	static getRCLFeastDays2020() {
		return [
 			// Advent 2019
			 { name: "First Week of Advent", start: "December 1, 2019", end: "December 1, 2019", color: "purple" },
			 { name: "Second Week of Advent", start: "December 8, 2019", end: "December 8, 2019", color: "purple" },
			 { name: "Third Week of Advent", start: "December 15, 2019", end: "December 15, 2019", color: "purple" },
			 { name: "Fourth Week of Advent", start: "December 22, 2019", end: "December 22, 2019", color: "purple" },
 
			// Christmas 2019
			 { name: "Nativity of the Lord", start: "December 24, 2019", end: "December 25, 2019", color: "yellow" },
			 { name: "First Sunday after Christmas Day", start: "December 27, 2019", end: "December 27, 2019", color: "yellow" },
			 { name: "Holy Name of Jesus", start: "January 1, 2020", end: "January 1, 2020", color: "yellow" },
			 { name: "Second Sunday after Christmas", start: "January 5, 2020", end: "January 5, 2020", color: "yellow" },

            // Epiphany
			{ name: "Epiphany of the Lord", start: "January 6, 2020", end: "January 6, 2020", color: "green" },
			{ name: "Baptism of the Lord", start: "January 12, 2020", end: "January 12, 2020", color: "yellow" },
			{ name: "Second Sunday after the Epiphany", start: "January 19, 2020", end: "January 19, 2020", color: "green" },
			{ name: "Third Sunday after the Epiphany", start: "January 26, 2020", end: "January 26, 2020", color: "green" },
			{ name: "Fourth Sunday after the Epiphany", start: "February 2, 2020", end: "February 2, 2020", color: "green" },
			{ name: "Presentation of the Lord", start: "February 2, 2020", end: "February 2, 2020", color: "green" },
			{ name: "Fifth Sunday after the Epiphany", start: "February 9, 2020", end: "February 9, 2020", color: "green" },
            { name: "Sixth Sunday after the Epiphany", start: "February 16, 2020", end: "February 16, 2020", color: "green" },
			{ name: "Transfiguration Sunday", start: "February 23, 2020", end: "February 23, 2020", color: "yellow" },

            // Lent
			{ name: "Ash Wednesday", start: "February 26, 2020", end: "February 26, 2020", color: "purple" },
			{ name: "First Sunday in Lent", start: "March 1, 2020", end: "March 1, 2020", color: "purple" },
			{ name: "Second Sunday in Lent", start: "March 8, 2020", end: "March 8, 2020", color: "purple" },
			{ name: "Third Sunday in Lent", start: "March 15, 2020", end: "March 15, 2020", color: "purple" },
			{ name: "Fourth Sunday in Lent", start: "March 22, 2020", end: "March 22, 2020", color: "purple" },
			{ name: "Annunciation of the Lord", start: "March 25, 2020", end: "March 25, 2020", color: "yellow" },
			{ name: "Fifth Sunday in Lent", start: "March 29, 2020", end: "March 29, 2020", color: "purple" },
			{ name: "Palm Sunday or Passion Sunday", start: "April 5, 2020", end: "April 5, 2020", color: "purple" },

            // Holy Week
			{ name: "Holy Monday", start: "April 6, 2020", end: "April 6, 2020", color: "purple" },
			{ name: "Holy Tuesday", start: "April 7, 2020", end: "April 7, 2020", color: "purple" },
			{ name: "Holy Wednesday", start: "April 8, 2020", end: "April 8, 2020", color: "purple" },
			{ name: "Holy Thursday", start: "April 9, 2020", end: "April 9, 2020", color: "purple" },
			{ name: "Holy Friday", start: "April 10, 2020", end: "April 10, 2020", color: "purple" },
			{ name: "Holy Saturday", start: "April 11, 2020", end: "April 11, 2020", color: "purple" },

            // Easter
			{ name: "Resurrection of the Lord", start: "April 12, 2020", end: "April 12, 2020", color: "yellow" },
			{ name: "Easter Evening", start: "April 12, 2020", end: "April 12, 2020", color: "yellow" },
			{ name: "Second Sunday of Easter", start: "April 19, 2020", end: "April 19, 2020", color: "yellow" },
			{ name: "Third Sunday of Easter", start: "April 26, 2020", end: "April 26, 2020", color: "yellow" },
			{ name: "Fourth Sunday of Easter", start: "May 3, 2020", end: "May 3, 2020", color: "yellow" },
			{ name: "Fifth Sunday of Easter", start: "May 10, 2020", end: "May 10, 2020", color: "yellow" },
			{ name: "Sixth Sunday of Easter", start: "May 17, 2020", end: "May 17, 2020", color: "yellow" },
			{ name: "Ascension of the Lord", start: "May 21, 2020", end: "May 21, 2020", color: "yellow" },
			{ name: "Seventh Sunday of Easter", start: "May 24, 2020", end: "May 24, 2020", color: "yellow" },
			{ name: "Visitation of Mary to Elizabeth", start: "May 31, 2020", end: "May 31, 2020", color: "yellow" },
			{ name: "Day of Pentecost", start: "May 31, 2020", end: "May 31, 2020", color: "red" },

            // After Pentecost
			{ name: "Trinity Sunday", start: "June 7, 2020", end: "June 7, 2020", color: "yellow" },
			{ name: "Proper 6 (11)", start: "June 14, 2020", end: "June 14, 2020", color: "green" },
			{ name: "Proper 7 (12)", start: "June 21, 2020", end: "June 21, 2020", color: "green" },
			{ name: "Proper 8 (13)", start: "June 28, 2020", end: "June 28, 2020", color: "green" },
			{ name: "Proper 9 (14)", start: "July 5, 2020", end: "July 5, 2020", color: "green" },
			{ name: "Proper 10 (15)", start: "July 12, 2020", end: "July 12, 2020", color: "green" },
			{ name: "Proper 11 (16)", start: "July 19, 2020", end: "July 19, 2020", color: "green" },
			{ name: "Proper 12 (17)", start: "July 26, 2020", end: "July 26, 2020", color: "green" },
			{ name: "Proper 13 (18)", start: "August 2, 2020", end: "August 2, 2020", color: "green" },
			{ name: "Proper 14 (19)", start: "August 9, 2020", end: "August 9, 2020", color: "green" },
			{ name: "Proper 15 (20)", start: "August 16, 2020", end: "August 16, 2020", color: "green" },
			{ name: "Proper 16 (21)", start: "August 23, 2020", end: "August 23, 2020", color: "green" },
			{ name: "Proper 17 (22)", start: "August 30, 2020", end: "August 30, 2020", color: "green" },
			{ name: "Proper 18 (23)", start: "September 6, 2020", end: "September 6, 2020", color: "green" },
			{ name: "Proper 19 (24)", start: "September 13, 2020", end: "September 13, 2020", color: "green" },
			{ name: "Holy Cross", start: "September 14, 2020", end: "September 14, 2020", color: "red" },
			{ name: "Proper 20 (25)", start: "September 20, 2020", end: "September 20, 2020", color: "green" },
			{ name: "Proper 21 (26)", start: "September 27, 2020", end: "September 27, 2020", color: "green" },
			{ name: "Proper 22 (27)", start: "October 4, 2020", end: "October 4, 2020", color: "green" },
			{ name: "Proper 23 (28)", start: "October 11, 2020", end: "October 11, 2020", color: "green" },
			{ name: "Canadian Thanksgiving Day", start: "October 12, 2020", end: "October 12, 2020", color: "green" },
			{ name: "Proper 24 (29)", start: "October 18, 2020", end: "October 18, 2020", color: "green" },
			{ name: "Proper 25 (30)", start: "October 25, 2020", end: "October 25, 2020", color: "green" },
			{ name: "Proper 26 (31)", start: "November 1, 2020", end: "November 1, 2020", color: "green" },
			{ name: "All Saints Day", start: "November 1, 2020", end: "November 1, 2020", color: "green" },
			{ name: "Proper 27 (32)", start: "November 8, 2020", end: "November 8, 2020", color: "green" },
			{ name: "Proper 28 (33)", start: "November 15, 2020", end: "November 15, 2020", color: "green" },
			{ name: "Reign of Christ - Proper 29 (34)", start: "November 22, 2020", end: "November 22, 2020", color: "yellow" },
			{ name: "Thanksgiving Day, USA", start: "November 26, 2020", end: "November 26, 2020", color: "green" },
 		];
	}

	static getChurchHolidays2020() {
		return [
            { start: "January 6, 2020", name: "Ephiphany" },
			{ start: "February 14, 2020", name: "St. Valentine's Day" },
			{ start: "February 26, 2020", name: "Ash Wednesday" },
			{ start: "March 17, 2020", name: "St. Patrick's Day" },
			{ start: "March 25, 2020", name: "Annunciation Sunday" },
			{ start: "April 5, 2020", name: "Palm Sunday" },
			{ start: "April 6, 2020", name: "Holy Monday" },
			{ start: "April 7, 2020", name: "Holy Tuesday" },
			{ start: "April 8, 2020", name: "Holy Wednesday" },
			{ start: "April 9, 2020", name: "Maundy Thursday" },
			{ start: "April 10, 2020", name: "Good Friday" },
			{ start: "April 11, 2020", name: "Easter Vigil" },
			{ start: "April 12, 2020", name: "Easter" },
			{ start: "May 21, 2020", name: "Ascension Day" },
			{ start: "May 31, 2020", name: "Pentecost" },
			{ start: "October 31, 2020", name: "All Saints Vigil / Reformation Day" },
			{ start: "November 1, 2020", name: "All Saints Day" },
			{ start: "November 26, 2020", name: "Thanksgiving" },
        ];
	}

	static getUSHolidays2020() {
		return [
            { start: "January 1, 2020", name: "New Year's Day" },
			{ start: "January 20, 2020", name: "Martin Luther Ling, Jr. Day" },
			{ start: "February 17, 2020", name: "President's Day" },
			{ start: "May 10, 2020", name: "Mother's Day" },
			{ start: "May 25, 2020", name: "Memorial Day" },
			{ start: "June 16, 2020", name: "Father's Day" },
			{ start: "July 3, 2020", name: "Independence Day (Observed)" },
			{ start: "July 4, 2020", name: "Independence Day" },
			{ start: "September 7, 2020", name: "Labor Day" },
			{ start: "10/31/2020", name: "Halloween" },
			{ start: "11/3/2020", name: "Election Day"},
			{ start: "November 11, 2020", name: "Columbus Day" },
			{ name: "Thanksgiving Day", start:"11/26/2020", end:"11/27/2020"},
			{ start: "December 25, 2020", name: "Christmas Day" },
			{ start: "December 31, 2020", name: "New Year's Eve" },
			{ name: "New Year's Day", start: "1/1/2021"},
        ];
	}
}
