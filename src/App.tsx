import { useEffect, useState } from 'react';

const AppHook = ({input}: {input: string}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string|null>(null);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const callApi = ({searchText, signal}: {searchText: string, signal: AbortSignal}) => {
    const req: RequestInit = {
      method: 'GET',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'allow': 'GET, HEAD, OPTIONS',
        'access-control-allow-origin': '*',
      }
    };
    return fetch(`http://localhost:3000/?q=${searchText}`, {method: req.method, signal})
      .then(async (res) => {
        const results = await res.text();
        setResults(results);
        setIsSuccess(true);
        setIsError(false);
        setError(null);
      })
      .catch((err) => {
        setIsSuccess(false);
        setResults(null);
        setIsError(false);
        if (err instanceof DOMException && err.ABORT_ERR) {
          return;
        }
        setError(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setResults(null);
    callApi({searchText: input, signal: controller.signal});

    return () => controller.abort();
  }, [input]);

  return {
    isLoading,
    results,
    error,
    isError,
    isSuccess,
  }
};

const App = () => {
  const [name, setName] = useState('Mary');

  const {
    isLoading,
    results,
    error,
    isError,
    isSuccess,
  } = AppHook({input: name});

  return (<div>
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
    </form>
    <div>
      {isLoading && <div>Loading...</div>}
      {isSuccess && <div>Success!</div>}
      {results && <div>{results}</div>}
      {isError && <div>Error!</div>}
    </div>
  </div>)
};

export default App;
