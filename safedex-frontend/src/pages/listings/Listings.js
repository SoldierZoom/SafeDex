import { Link } from 'react-router-dom';

export default function Listings() {
    return (
        <div>
            <h1>This is the property listing page</h1>
            <Link 
                to="/listings/1/safety"
                className="text-blue-500 underline hover:text-blue-700">
                View Safety Score
            </Link>
        </div>
    )
    
}
