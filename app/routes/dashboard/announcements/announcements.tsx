import {
  Box,
  Typography,
  Button,
  Divider,
  CardContent,
  Card,
  CardActions,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router';
import SmsIcon from '@mui/icons-material/Sms';
import { useSnackbar } from 'notistack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Announcements() {
  const theme = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      'https://app.givingheartsday.org/#/charity/1870'
    );
    console.log('Link copied to clipboard');
    enqueueSnackbar('Link copied to clipboard', { variant: 'success' });
  };

  return (
    <>
      {/* Main Content */}
      <Stack direction="column" spacing={2} padding={2}>
        {/* Announcement Title */}
        <Card variant="outlined" sx={{ padding: 1 }}>
          <CardContent>
            <Typography variant="h2" gutterBottom>
              Giving Hearts Day
            </Typography>

            {/* Charity Link with Copy Button */}
            <Typography variant="body1">
              Giving Hearts Day Charity Page:
              https://app.givingheartsday.org/#/charity/1870
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={handleCopyLink}
              endIcon={<ContentCopyIcon />}
            >
              Copy Link
            </Button>
          </CardActions>
        </Card>

        <Divider />

        {/* Sample Texts Section */}
        <Typography variant="h3" gutterBottom>
          Sample Texts to send
        </Typography>

        {/* Text for People Who Know About Camp */}
        <Card variant="outlined" sx={{ padding: 1 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              To People Who know about Camp
            </Typography>
            <Typography variant="body1">
              Right now, every donation to Royal Family Kids Fargo is matched
              dollar-for-dollar up to $5,500. If you are in a position to give
              we'd certainly appreciate it! Here's the link to donate:
              https://app.givingheartsday.org/#/charity/1870
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              component="a"
              href="sms:?&body=Right now, every donation to Royal Family Kids Fargo is matched dollar-for-dollar up to $5,500. If you are in a position to give we'd certainly appreciate it! Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
              fullWidth
              endIcon={<SmsIcon />}
            >
              Send Text
            </Button>
          </CardActions>
        </Card>

        {/* Text for Past Volunteers */}
        <Card variant="outlined" sx={{ padding: 1 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              To Past Volunteers
            </Typography>
            <Typography variant="body1">
              Right now, every donation to Royal Family Kids Camp is matched
              dollar-for-dollar up to $5,500. Would you be open to sharing a
              link to donate with 5 people you know? I'll send you a text you
              can forward along. (You can obvs make changes as necessary)
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              component="a"
              href="sms:?&body=Right now, every donation to Royal Family Kids Camp is matched dollar-for-dollar up to $5,500. Would you be open to sharing a link to donate with 5 people you know? I'll send you a text you can forward along. (You can obvs make changes as necessary) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
              fullWidth
              endIcon={<SmsIcon />}
            >
              Share Link
            </Button>
          </CardActions>
        </Card>

        {/* Text for Past Volunteers to share with their friends */}
        <Card variant="outlined" sx={{ padding: 1 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              To Past Volunteers to share with their friends:
            </Typography>
            <Typography variant="body1">
              A camp I volunteered at last summer for kids who’ve experienced
              abuse / neglect currently has donors willing to match donations up
              to $5,500. Would you consider donating? The organization is 100%
              volunteer run meaning all proceeds go to the camp. Here is a link:
              https://app.givingheartsday.org/#/charity/1870
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              component="a"
              href="sms:?&body=A camp I volunteered at last summer for kids who’ve experienced abuse / neglect currently has donors willing to match donations up to $5,500. Would you consider donating? The organization is 100% volunteer run meaning all proceeds go to the camp. Here is a link: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
              fullWidth
              endIcon={<SmsIcon />}
            >
              Send Text
            </Button>
          </CardActions>
        </Card>

        {/* Text for People Who Don't Know About Camp */}
        <Card variant="outlined" sx={{ padding: 1 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              To People who don't know about camp:
            </Typography>
            <Typography variant="body1">
              A camp I help plan every year called Royal Family Kids (a camp for
              abused/neglected kids) currently has generous donors willing to
              match up to $5500. If you are in a position to donate, we'd really
              appreciate the support. 100% of proceeds goes to making the camp
              special for the kids as we all volunteer our time to make it
              happen. Are you open to sending you a link to donate? (every
              little bit helps)
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component="a"
              variant="contained"
              href="sms:?&body=A camp I help plan every year called Royal Family Kids (a camp for abused/neglected kids) currently has generous donors willing to match up to $5500. If you are in a position to donate, we'd really appreciate the support. 100% of proceeds goes to making the camp special for the kids as we all volunteer our time to make it happen. Are you open to sending you a link to donate? (every little bit helps) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
              fullWidth
              endIcon={<SmsIcon />}
            >
              Send Text
            </Button>
          </CardActions>
        </Card>
      </Stack>

      {/* Outlet for Nested Routes */}
      <Box flexGrow={1}>
        <Outlet />
      </Box>
    </>
  );
}
