import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';

interface NavigationSuggestionsProps {
  suggestions: Array<{
    route: string;
    description: string;
  }>;
}

const NavigationSuggestions: React.FC<NavigationSuggestionsProps> = ({
  suggestions,
}) => {
  const navigate = useNavigate();

  if (suggestions.length === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-2 p-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate(suggestion.route)}
        >
          {suggestion.description}
        </Button>
      ))}
    </div>
  );
};

export default NavigationSuggestions;
