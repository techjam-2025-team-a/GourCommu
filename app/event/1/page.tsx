'use client';

import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Mock data for candidate dates (replace with DB fetch later)
const initialCandidateDates = [
  { id: 'date1', date: '2025年9月1日 (月)', votesYes: 10, votesNo: 2 },
  { id: 'date2', date: '2025年9月2日 (火)', votesYes: 5, votesNo: 7 },
  { id: 'date3', date: '2025年9月3日 (水)', votesYes: 15, votesNo: 1 },
  { id: 'date4', date: '2025年9月4日 (木)', votesYes: 8, votesNo: 4 },
];

export default function Event1Page() {
  const [displayCandidateDates, setDisplayCandidateDates] = useState(initialCandidateDates);
  const [username, setUsername] = useState('');
  const [votes, setVotes] = useState<{ [key: string]: '〇' | '✕' }>({});

  const handleVoteChange = (dateId: string, value: '〇' | '✕') => {
    const previousVote = votes[dateId];
    const newVoteValue = previousVote === value ? undefined : value;

    // Update votes state
    setVotes((prevVotes) => ({
      ...prevVotes,
      [dateId]: newVoteValue,
    }));

    // Update vote counts
    setDisplayCandidateDates((prevDates) =>
      prevDates.map((date) => {
        if (date.id === dateId) {
          const newDate = { ...date };

          // Decrement previous vote
          if (previousVote === '〇') {
            newDate.votesYes--;
          } else if (previousVote === '✕') {
            newDate.votesNo--;
          }

          // Increment new vote
          if (newVoteValue === '〇') {
            newDate.votesYes++;
          } else if (newVoteValue === '✕') {
            newDate.votesNo++;
          }
          return newDate;
        }
        return date;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Votes:', votes);
    // Here you would typically send this data to your backend
    alert('投票を送信しました！\nユーザー名: ' + username + '\n投票内容: ' + JSON.stringify(votes));
  };

  return (
    <div className="min-h-screen font-sans bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          日付投票
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <Label htmlFor="username" className="text-gray-800">
              お名前
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="お名前を入力してください"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Date Voting Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              候補日への投票
            </h2>
            {displayCandidateDates.map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
              >
                <span className="font-medium text-gray-800">{date.date}</span>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={votes[date.id] === '〇' ? 'default' : 'outline'}
                    onClick={() => handleVoteChange(date.id, '〇')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md ${votes[date.id] === '〇'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-300'
                    }`}
                  >
                    <span>〇</span>
                    <span className="text-gray-500 text-xs">({date.votesYes})</span>
                  </Button>
                  <Button
                    type="button"
                    variant={votes[date.id] === '✕' ? 'default' : 'outline'}
                    onClick={() => handleVoteChange(date.id, '✕')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md ${votes[date.id] === '✕'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-300'
                    }`}
                  >
                    <span>✕</span>
                    <span className="text-gray-500 text-xs">({date.votesNo})</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
            投票を送信
          </Button>
        </form>
      </div>
    </div>
  );
}