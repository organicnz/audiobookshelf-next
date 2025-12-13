import { Book } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Martian',
    author: 'Andy Weir',
    description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he\'s sure he\'ll be the first person to die there.',
    cover: 'https://picsum.photos/seed/martian/400/600',
    duration: 36000,
    progress: 1200,
    genres: ['Sci-Fi', 'Adventure'],
    addedAt: '2023-10-01'
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    cover: 'https://picsum.photos/seed/hailmary/400/600',
    duration: 42000,
    progress: 0,
    genres: ['Sci-Fi', 'Thriller'],
    addedAt: '2023-11-15'
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    cover: 'https://picsum.photos/seed/dune/400/600',
    series: 'Dune Saga #1',
    duration: 54000,
    progress: 5400,
    genres: ['Sci-Fi', 'Epic'],
    addedAt: '2023-09-01'
  },
  {
    id: '4',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
    cover: 'https://picsum.photos/seed/atomic/400/600',
    duration: 20000,
    progress: 18000,
    genres: ['Self-Help', 'Psychology'],
    addedAt: '2024-01-10'
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A curious Hobbit, Bilbo Baggins, journeys to the Lonely Mountain with a vigorous group of Dwarves to reclaim a treasure stolen from them by the dragon Smaug.',
    cover: 'https://picsum.photos/seed/hobbit/400/600',
    series: 'Middle Earth',
    duration: 32000,
    progress: 100,
    genres: ['Fantasy', 'Classic'],
    addedAt: '2023-08-20'
  },
  {
    id: '6',
    title: '1984',
    author: 'George Orwell',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
    cover: 'https://picsum.photos/seed/1984/400/600',
    duration: 28000,
    progress: 0,
    genres: ['Classic', 'Dystopian'],
    addedAt: '2023-07-04'
  }
];
