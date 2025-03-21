interface LoansCellProps {
  id: number;
}

export function LoanCellId({ id }: LoansCellProps) {
  return (
    <div>
      <span>{id}</span>
    </div>
  );
}
