import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';

// interface KanbanControlsProps {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   filterAssigned: string;
//   setFilterAssigned: (assigned: string) => void;
//   assignedOptions: string[];
// }

export default function KanbanControls({
  searchTerm,
  setSearchTerm,
  filterAssigned,
  setFilterAssigned,
  assignedOptions,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <TextField
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
        variant="outlined"
      />
      <FormControl variant="outlined" className="w-full sm:w-[180px]">
        <InputLabel>Filter by assigned</InputLabel>
        <Select
          value={filterAssigned}
          onChange={(e) => setFilterAssigned(e.target.value)}
          label="Filter by assigned"
        >
          <MenuItem value="all">All</MenuItem>
          {assignedOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

