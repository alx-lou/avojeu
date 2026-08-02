import styles from './list.module.css';

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
};

export function List<T>({
  items,
  renderItem,
  orientation = 'vertical',
}: ListProps<T>) {
  const className = `${styles.list} ${orientation === 'horizontal' ? styles.horizontal : ''}`.trim();

  return (
    <div className={className}>
      {items.map(renderItem)}
    </div>
  );
}