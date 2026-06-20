import { useState, useEffect } from 'react';
import type { Employee } from '../models/core/Employee';
import { EmployeePosition } from '../models/core/Employee';

const mockEmployees: Employee[] = [
  { id: "e1", name: "Alice", surname: "Smith", email: "alice@example.com", joinedAt: new Date().toISOString(), createdAt: new Date().toISOString(), position: EmployeePosition.Developer },
  { id: "e2", name: "Bob", surname: "Jones", email: "bob@example.com", joinedAt: new Date().toISOString(), createdAt: new Date().toISOString(), position: EmployeePosition.Manager },
];

export const useEmployeeSearch = (maxResults: number) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(mockEmployees.slice(0, maxResults));
      return undefined;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      if (active) {
        const filtered = mockEmployees.filter((e) => 
          `${e.name} ${e.surname}`.toLowerCase().includes(inputValue.toLowerCase()) || 
          e.email?.toLowerCase().includes(inputValue.toLowerCase())
        );
        setOptions(filtered.slice(0, maxResults));
        setLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue, maxResults]);

  return { options, inputValue, setInputValue, loading };
};
