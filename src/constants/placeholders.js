export const newTravelProgramDefault = (name, name_eng) => ({
  name,
  name_eng,
  bgImages: [],
  secondPageTables: {
    routeDetailsTable: {
      review: [...Array(3)].map((_, i) => ({
        day: new Date(),
        numOfDay: i + 1,
        activity: [...Array(3)].map((_, i) => ({
          icon: i === 1 ? 'plane' : 'none',
          dayActivity: {
            line1: 'title',
            line2: 'subtitle',
            line3: 'one more line',
            more: 'more info',
            isFlight: i === 1,
          },
        })),
      })),
    },

    accommodation: [...Array(3)].map((_, i) => ({
      period: `${i + 1} - ${i + 2}`,
      hotelName: 'Hotel Name' + (i + 1),
      details: 'Details' + (i + 1),
      numOfNights: 3,
    })),
  },
  fourthPageDay: {
    gallery: [],
    daysData: {
      header: { date: new Date(), dayIndex: 1 },
      title: 'Заголовок',
      nights: 1,
      subtitle: 'Подзаголовок',
      description: 'Описание',
      pros: ['Pros_1', 'Pros_2', 'Pros_3'],
      info: ['Info_1', 'Info_2', 'Info_3'],
      schedule: [
        {
          title: 'Заголовок_1',
          description: 'Описание_1',
        },
        {
          title: 'Заголовок_2',
          description: 'Описание_2',
        },
        {
          title: 'Заголовок_3',
          description: 'Описание_3',
        },
      ],
    },
  },
});

export const newMapData = {
  logistics: [
    {
      city: 'Tokyo',
      coordinates: [139.7671, 35.6812],
      routeType: 'flight',
      markerColor: '',
      sourceMapIcon: 'startPoint',
      sourceListIcon: 'flightArrivalMarker',
      time: '0ч 00мин',
      distance: '000км',
      hotel: 'Hotel name',
    },
    {
      city: 'Osaka',
      coordinates: [135.5023, 34.6937],
      routeType: 'driving',
      markerColor: '',
      sourceMapIcon: 'startPoint',
      sourceListIcon: 'hotelMarker',
      time: '0ч 00мин',
      distance: '000км',
      hotel: 'Hotel name',
    },
    {
      city: 'Kyoto',
      coordinates: [135.7681, 35.0116],
      routeType: 'flight',
      markerColor: '',
      sourceMapIcon: 'startPoint',
      sourceListIcon: 'hotelMarker',
      time: '0ч 00мин',
      distance: '000км',
      hotel: 'Hotel name',
    },
  ],
  mapCenter: [138.46675563464663, 36.35583007420196],
  zoom: 6,
};
