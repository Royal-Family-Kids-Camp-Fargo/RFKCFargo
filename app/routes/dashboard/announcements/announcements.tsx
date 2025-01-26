import { Box, Typography, Button, Divider, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { TopNav } from "~/components/TopNav";
import DashNav from "~/components/DashNav";
import { Outlet } from "react-router";

export default function Announcements() {
  const theme = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://app.givingheartsday.org/#/charity/1870");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      {/* Main Content */}
      <Box sx={{ padding: theme.spacing(2) }}>
        {/* Announcement Title */}
        <Typography variant="h2" gutterBottom>
          Giving Hearts Day
        </Typography>

        {/* Charity Link with Copy Button */}
        <Typography variant="body1" paragraph>
          Giving Hearts Day Charity Page: https://app.givingheartsday.org/#/charity/1870
          <Button
            onClick={handleCopyLink}
            size="small"
            sx={{ fontSize: '1rem', padding: theme.spacing(1, 2), backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'block', margin: theme.spacing(1, 0) }}
          >
            Copy Link
          </Button>
        </Typography>

        {/* Sample Texts Section */}
        <Typography variant="h3" gutterBottom>
          Sample Texts to send
        </Typography>

        {/* Text for People Who Know About Camp */}
        <Typography variant="h4" paragraph>
          To People Who know about Camp:
        </Typography>
        <Typography variant="body2" paragraph>
          Right now, every donation to Royal Family Kids Fargo is matched dollar-for-dollar up to $5,500. If you are in a position to give we'd certainly appreciate it! Here's the link to donate: https://app.givingheartsday.org/#/charity/1870
          <Button
            href="sms:?&body=Right now, every donation to Royal Family Kids Fargo is matched dollar-for-dollar up to $5,500. If you are in a position to give we'd certainly appreciate it! Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
            target="_blank"
            sx={{ fontSize: '1rem', padding: theme.spacing(1, 2), backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'block', margin: theme.spacing(1, 0) }}
          >
            Send Text
          </Button>
        </Typography>

        {/* Text for Past Volunteers */}
        <Typography variant="h4" paragraph>
          To Past Volunteers:
        </Typography>
        <Typography variant="body2" paragraph>
          Right now, every donation to Royal Family Kids Camp is matched dollar-for-dollar up to $5,500. Would you be open to sharing a link to donate with 5 people you know? I'll send you a text you can forward along. (You can obvs make changes as necessary)
          <Button
            href="sms:?&body=Right now, every donation to Royal Family Kids Camp is matched dollar-for-dollar up to $5,500. Would you be open to sharing a link to donate with 5 people you know? I'll send you a text you can forward along. (You can obvs make changes as necessary) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
            target="_blank"
            sx={{ fontSize: '1rem', padding: theme.spacing(1, 2), backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'block', margin: theme.spacing(1, 0) }}
          >
            Share Link
          </Button>
        </Typography>
        {/* Text for Past Volunteers to share with their friends */}
        <Typography variant="h5" paragraph>
          To Past Volunteers to share with their friends:
        </Typography>
        <Typography variant="body2" paragraph>
            A camp I volunteered at last summer for kids who’ve experienced abuse / neglect currently has donors willing to match donations up to $5,500. Would you consider donating? The organization is 100% volunteer run meaning all proceeds go to the camp. Here is a link: https://app.givingheartsday.org/#/charity/1870
            <Button
              href="sms:?&body=A camp I volunteered at last summer for kids who’ve experienced abuse / neglect currently has donors willing to match donations up to $5,500. Would you consider donating? The organization is 100% volunteer run meaning all proceeds go to the camp. Here is a link: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
              sx={{ fontSize: '1rem', padding: theme.spacing(1, 2), backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'block', margin: theme.spacing(1, 0) }}
            >
              Send Text
            </Button>
        </Typography>

        {/* Text for People Who Don't Know About Camp */}
        <Typography variant="h4" paragraph>
          To People who don't know about camp:
        </Typography>
        <Typography variant="body2" paragraph>
          A camp I help plan every year called Royal Family Kids (a camp for abused/neglected kids) currently has generous donors willing to match up to $5500. If you are in a position to donate, we'd really appreciate the support. 100% of proceeds goes to making the camp special for the kids as we all volunteer our time to make it happen. Are you open to sending you a link to donate? (every little bit helps)
          <Button
            href="sms:?&body=A camp I help plan every year called Royal Family Kids (a camp for abused/neglected kids) currently has generous donors willing to match up to $5500. If you are in a position to donate, we'd really appreciate the support. 100% of proceeds goes to making the camp special for the kids as we all volunteer our time to make it happen. Are you open to sending you a link to donate? (every little bit helps) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
            target="_blank"
            sx={{ fontSize: '1rem', padding: theme.spacing(1, 2), backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'block', margin: theme.spacing(1, 0) }}
          >
            Send Text
          </Button>
        </Typography>
      </Box>

      {/* Snackbar for Copy Confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />

      {/* Outlet for Nested Routes */}
      <Box flexGrow={1}>
        <Outlet />
      </Box>
    </>
  );
}
