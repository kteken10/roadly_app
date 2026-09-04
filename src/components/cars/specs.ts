import type { Spec } from '@/components/ui';
import type { Car } from '@/domain/types';

/** The at-a-glance line: range, walking distance, then two capability glyphs. */
export function glanceSpecs(car: Car): Spec[] {
  return [
    { symbol: car.powertrain === 'electric' ? 'battery.100' : 'fuelpump.fill', value: `${car.rangeKm} km` },
    { symbol: 'figure.walk', value: `${car.walkMinutes} min` },
    { symbol: 'snowflake', value: '' },
    { symbol: car.powertrain === 'petrol' ? 'bolt.fill' : 'bolt.car.fill', value: '' },
  ];
}

/** The four-up grid on the detail screen — the descendant of the Flutter CarItems row. */
export function detailSpecs(car: Car): { label: string; value: string }[] {
  return [
    { label: 'Power', value: `${car.powerHp} hp` },
    { label: '0–100', value: `${car.acceleration.toFixed(1)}s` },
    { label: 'CO₂', value: `${car.co2} g/km` },
    { label: 'Consumption', value: `${car.consumption.toString().replace('.', ',')} L` },
  ];
}
