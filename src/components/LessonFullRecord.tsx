import React from 'react';
import { Box, Chip } from '@mui/material';
import { DetailGroup, DetailItem } from './DetailList';
import { Lesson } from '../types';
import { formatDate } from '../utils/dateHelpers';

const LessonFullRecord: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
  <Box
    sx={{
      pt: 2,
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      columnGap: 4,
      rowGap: 3,
      alignItems: 'start',
    }}
  >
    <DetailGroup title="Trainee" icon="user">
      <DetailItem label="Email" value={lesson.trainee.email} />
      {lesson.trainee.phone && <DetailItem label="Phone" value={lesson.trainee.phone} />}
      <DetailItem label="Licence class" value={lesson.trainee.licenseClass} />
    </DetailGroup>

    <DetailGroup title="Instructor" icon="steering-wheel">
      <DetailItem label="Licence" value={lesson.instructor.licenseNumber} />
      <DetailItem label="Experience" value={`${lesson.instructor.yearsExperience} years`} />
      <DetailItem
        label="Specialisations"
        value={
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {lesson.instructor.specializations.map((specialisation) => (
              <Chip key={specialisation} label={specialisation} size="small" variant="outlined" />
            ))}
          </Box>
        }
      />
    </DetailGroup>

    <DetailGroup title="Vehicle" icon="car">
      <DetailItem
        label="Model"
        value={`${lesson.vehicle.year} ${lesson.vehicle.make} ${lesson.vehicle.model}`}
      />
      <DetailItem label="Type" value={lesson.vehicle.type} />
      <DetailItem label="Colour" value={lesson.vehicle.color} />
    </DetailGroup>

    <DetailGroup title="Booking" icon="calendar">
      <DetailItem label="Date" value={formatDate(lesson.date)} />
      <DetailItem label="Reference" value={lesson.id} />
    </DetailGroup>
  </Box>
);

export default LessonFullRecord;
