import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import './App.css';
import Home from './pages/Home'
import Task from "./pages/Task";


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:3002/graphql',
  cache
});

export default function App() {
  return (
    <div className="app">
      <Router>
        <ApolloProvider client={client}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="task/:id" element={<Task />} />
            <Route path="*" element={<main><h2>Error 404</h2></main>} />
          </Routes>
        </ApolloProvider>
      </Router>
    </div>
        
  )
}
