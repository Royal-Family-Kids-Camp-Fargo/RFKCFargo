import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { User } from "~/api/objects/user";
  
/**
 * UserCard component.
 */
export default function UserCard({ user }: { user: User }) {
    return (
        <Accordion 
            elevation={1}
            sx={{
                mb: 1,
                p: 1,
                backgroundColor: "#f8f9fa",
                }}
                >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {user.first_name || user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "No Name"}
        </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
                {user.email}
            </Typography>
            <Typography variant="body2">
                {user.phone_number || "No Phone"}
            </Typography>
            <Typography variant="body2">
              Assigned to: {user.assigned_to?.first_name || "No Assignment"}
            </Typography>
            <ArrowBackIcon sx={{ mr: 1 }} />
            <ArrowForwardIcon sx={{ ml: 1 }} />
          </AccordionDetails>
        </Accordion>
    );
}