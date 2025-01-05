import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router';

type ApplicationCardProps = {
  id?: string;
  name?: string;
};

export default function ApplicationCard(props: ApplicationCardProps) {
  return (
    <Card component={Link} to={`/dashboard/applications/${props.id}`}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6">{props.name}</Typography>
          <Typography variant="body2">{`ID: ${props.id}`}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
