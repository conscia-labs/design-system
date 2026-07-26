import * as React from "react";

import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Textarea } from "./textarea";
import { cn } from "./utils";

/**
 * Temporary Admin UI migration aliases. New product code should import the
 * clean primitive names from @conscia-labs/design-system.
 */
const ConsciaButton = Button;

function ConsciaIconButton({
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button size={size} {...props} />;
}

const ConsciaCard = Card;
const ConsciaCardContent = CardContent;
const ConsciaCardDescription = CardDescription;

function ConsciaCardHeader({
  actionRight,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CardHeader> & {
  actionRight?: React.ReactNode;
}) {
  if (!actionRight) {
    return (
      <CardHeader className={className} {...props}>
        {children}
      </CardHeader>
    );
  }

  return (
    <CardHeader
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4",
        className,
      )}
      {...props}
    >
      <div className="grid gap-2">{children}</div>
      <div className="justify-self-end">{actionRight}</div>
    </CardHeader>
  );
}

const ConsciaCardTitle = CardTitle;
const ConsciaCheckbox = Checkbox;
const ConsciaInput = Input;
const ConsciaSwitch = Switch;
const ConsciaTextarea = Textarea;
const ConsciaSelect = Select;
const ConsciaSelectContent = SelectContent;
const ConsciaSelectGroup = SelectGroup;
const ConsciaSelectItem = SelectItem;
const ConsciaSelectTrigger = SelectTrigger;
const ConsciaSelectValue = SelectValue;
const ConsciaTable = Table;
const ConsciaTableBody = TableBody;
const ConsciaTableCell = TableCell;
const ConsciaTableHeader = TableHeader;
const ConsciaTableHead = TableHead;
const ConsciaTableRow = TableRow;

export {
  ConsciaButton,
  ConsciaCard,
  ConsciaCardContent,
  ConsciaCardDescription,
  ConsciaCardHeader,
  ConsciaCardTitle,
  ConsciaCheckbox,
  ConsciaIconButton,
  ConsciaInput,
  ConsciaSwitch,
  ConsciaTextarea,
  ConsciaSelect,
  ConsciaSelectContent,
  ConsciaSelectGroup,
  ConsciaSelectItem,
  ConsciaSelectTrigger,
  ConsciaSelectValue,
  ConsciaTable,
  ConsciaTableBody,
  ConsciaTableCell,
  ConsciaTableHeader,
  ConsciaTableHead,
  ConsciaTableRow,
};
