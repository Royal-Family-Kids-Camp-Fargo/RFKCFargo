import { useNavigation } from 'react-router';
import { NavigationSuggestions as StyledNavigationSuggestions, SuggestionButton } from './styles';

interface NavigationSuggestionsProps {
  suggestions: Array<{
    route: string;
    description: string;
  }>;
}

const NavigationSuggestions: React.FunctionComponent<NavigationSuggestionsProps> = ({ suggestions }) => {
  const navigate = useNavigation();

  if (suggestions.length === 0) return null;

  return (
    <StyledNavigationSuggestions>
      {suggestions.map((suggestion, index) => (
        <SuggestionButton
          key={index}
          variant="contained"
          onClick={() => {
            navigate(suggestion.route);
          }}
        >
          {suggestion.description}
        </SuggestionButton>
      ))}
    </StyledNavigationSuggestions>
  );
};

export default NavigationSuggestions; 