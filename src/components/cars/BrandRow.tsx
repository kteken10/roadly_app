import { ScrollView, StyleSheet } from 'react-native';

import { Chip, Monogram } from '@/components/ui';
import { brands } from '@/domain/catalog';
import type { BrandId } from '@/domain/types';
import { gutter, space } from '@/theme';

export type BrandRowProps = {
  selected: BrandId | null;
  onSelect: (id: BrandId | null) => void;
};

/**
 * Direct descendant of the Flutter `TabCarModel` row, with two fixes: the
 * selection is lifted into the store so it actually filters the list (it did
 * nothing before), and brand marks are typographic so the pills share a rhythm.
 */
export function BrandRow({ selected, onSelect }: BrandRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      decelerationRate="fast"
      snapToAlignment="start"
    >
      <Chip label="All" selected={selected === null} onPress={() => onSelect(null)} />
      {brands.map((brand) => {
        const isSelected = selected === brand.id;
        return (
          <Chip
            key={brand.id}
            label={brand.shortName}
            selected={isSelected}
            onPress={() => onSelect(isSelected ? null : brand.id)}
            leading={<Monogram letters={brand.monogram} size="sm" inverted={isSelected} />}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: gutter,
    gap: space.sm,
    alignItems: 'center',
  },
});
