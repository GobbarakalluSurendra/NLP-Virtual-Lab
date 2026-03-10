# ngrams - logic.py
# experiments/ngrams/logic.py

from collections import defaultdict
from .data import CORPUS


def tokenize():
    
    vocab = set()

    for sentence in CORPUS:

        words = sentence.lower().replace(",", "").split()

        vocab.update(words)

    vocab.add("(eos)")

    return sorted(vocab)


def ngram_counts(n: int):
    counts = defaultdict(int)
    history_counts = defaultdict(int)

    for sentence in CORPUS:
        words = sentence.lower().replace(",", "").split()
        
        # Pad with (n-1) (eos) at the start, and 1 (eos) at the end
        if n > 1:
            words = ["(eos)"] * (n - 1) + words + ["(eos)"]
        else:
            words = words + ["(eos)"]

        for i in range(len(words) - n + 1):
            ngram = tuple(words[i:i+n])
            history = tuple(words[i:i+n-1])
            
            counts[ngram] += 1
            history_counts[history] += 1
            
    # For unigrams (n=1), the history count is just the total number of words
    if n == 1:
        total_words = sum(counts.values())
        history_counts[()] = total_words

    return counts, history_counts

def ngram_probabilities(n: int, smooth: bool = False):
    counts, history_counts = ngram_counts(n)
    probs = defaultdict(dict)
    
    unique_histories = set()
    
    vocab = tokenize()
    V = len(vocab)

    for ngram, count in counts.items():
        history = ngram[:-1]
        word = ngram[-1]
        
        # Join history tuple into a readable string for frontend, e.g. "can i"
        history_str = " ".join(history)
        unique_histories.add(history_str)
        
        if smooth:
            # Laplace smoothing: (count(history + word) + 1) / (count(history) + V)
            probs[history_str][word] = round((count + 1) / (history_counts[history] + V), 3)
        else:
            probs[history_str][word] = round(count / history_counts[history], 3)

    # For smoothing, we also need to fill in 0-count n-grams so the frontend has them
    if smooth:
        # For all unique histories seen in the corpus (or theoretically all histories),
        # calculate the smoothed probability for every word in the vocabulary.
        for history_str in list(unique_histories):
            history_tuple = tuple(history_str.split()) if history_str else ()
            for word in vocab:
                if word not in probs[history_str]:
                    # count is 0
                    probs[history_str][word] = round(1 / (history_counts[history_tuple] + V), 3)

    return dict(probs), sorted(list(unique_histories))
