"use client"

import {queryOptions, useQuery} from "@tanstack/react-query";

export class FrankfurterExchangeRates {

    constructor(
        public readonly base: string,
        public readonly date: string,
        public readonly rates: Map<string, number>,
    ) {
    }

    isCurrencyAvailable(abbreviation?: string): boolean {
        return abbreviation !== undefined && this.rates.has(abbreviation);
    }
}

export const frankfurterKeys = {
    latest: ["frankfurter", "latest"] as const,
};

export const frankfurter = {
    queries: {
        latest: (baseCurrency: string | undefined) => queryOptions({
            queryKey: [...frankfurterKeys.latest, baseCurrency],
            queryFn: async ({signal}: {
                signal: AbortSignal
            }) => {
                const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`, {
                    headers: {'Content-Type': 'application/json'},
                    signal: signal,
                });
                const json = await response.json();

                return new FrankfurterExchangeRates(
                    json.base,
                    json.date,
                    new Map(Object.entries(json.rates))
                );
            },
            enabled: baseCurrency !== undefined,
        }),
    },
};

export function useFrankfurterLatest(baseCurrency: string | undefined) {
    return useQuery(frankfurter.queries.latest(baseCurrency));
}