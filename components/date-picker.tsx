import * as React from "react"

type Props = {
    value?: Date,
    onChange?: (date?: Date) => void;
    disabled?: boolean;
}

// export const DatePicker = ({
//     value,
//     onChange,
//     disabled
// }: Props) => {
//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button
//                     disabled={disabled}
//                     variant="outline"
//                     className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !value && "text-muted-foreground"
//                     )}
//                 >
//                     <CalendarIcon className="size-4 mr-2" />
//                     {value ? format(value, "PPP") : <span>Pick a date</span>}

//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="z-50 w-auto p-0">
//                 <Calendar 
//                 mode="single"
//                 selected={value}
//                 onSelect={onChange}
//                 disabled={disabled}
//                 initialFocus
//                 />
//             </PopoverContent>
//         </Popover>
//     )
// }

export const DateInput = ({
  value,
  onChange,
  disabled
}: Props) => {
  return (
    <div>
  <label htmlFor="date-picker" className="sr-only">
    Select a date
  </label>
  <input
    id="date-picker"
    type="date"
    placeholder="Pick a date"
    value={value ? value.toISOString().split("T")[0] : ""}
    onChange={(e) =>
      onChange?.(e.target.value ? new Date(e.target.value) : undefined)
    }
    disabled={disabled}
    className="border rounded p-2 w-full"
  />
</div>
  );
};



