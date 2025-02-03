import { Button } from '~/components/ui/button';
import { Link } from 'react-router';

export function HomeNav() {
  return (
    <div className="flex items-center justify-between py-4 px-8 gap-8">
      <h2 className="text-xl font-semibold">RFKC Fargo</h2>
      <Button asChild>
        <Link to="/sign-in">RFK Central</Link>
      </Button>
    </div>
  );
}
