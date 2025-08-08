import { useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import Plane from '../../assets/icons/plane.svg';
import { DayCell } from './DayCell';
import styles from './index.module.css';
import { selectTravelProgram } from '../../store/selectors';

export function FlightsTable() {
  const program = useSelector(selectTravelProgram);
  const reviewData = program?.secondPageTables?.routeDetailsTable?.review || [];
  console.log('reviewData', reviewData);
  const flightData = reviewData.filter(item =>
    item.activity.some(activity => activity.dayActivity.isFlight),
  );

  console.log('flightData', flightData);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivity = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  return (
    <div className={`${styles['details-table']} ${styles['flights-table']}`}>
      {flightData.map((dayData, index) => (
        <div key={index} className={styles['table-row']}>
          <DayCell
            title={`${dayData.numOfDay}`}
            subtitle={dayjs(dayData.day).format('dddd')}
            date={dayjs(dayData.day).format('DD MMM YYYY')}
          />
          <div className={styles['activities-cell']}>
            {dayData.activity
              .filter(activity => activity.dayActivity.isFlight)
              .map(activity => (
                <div key={activity.id} className={styles['activity-item']}>
                  <Plane height={20} width={20} className={styles['activity-icon']} />
                  <div className={styles['activity-details']}>
                    <div>{activity.dayActivity.line1}</div>
                    {activity.dayActivity.line2 && <div>{activity.dayActivity.line2}</div>}
                    {activity.dayActivity.line3 && <div>{activity.dayActivity.line3}</div>}
                    {activity.dayActivity.more && (
                      <div className={styles['activity-subtext']}>
                        <div
                          className={styles['more-text']}
                          onClick={e => toggleActivity(activity.id, e)}>
                          {expandedActivities[activity.id] ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
                        </div>
                        <div
                          className={`${styles['more-details']} ${
                            expandedActivities[activity.id] ? styles.expanded : ''
                          }`}>
                          {activity.dayActivity.more}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
