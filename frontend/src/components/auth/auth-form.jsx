import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { Form } from '@heroui/react';
import { Divider } from '@heroui/react';

export default function AuthForm({
  title,
  children,
  footer,
  onSubmit,
  errors,
}) {
  return (
    <Card className="p-4 lg:p-7 w-full md:w-[450px] h-fit mb-[4rem] bg-background md:bg-content1 shadow-none md:shadow-medium">
      <CardHeader className="justify-center md:p-3 p-6">
        <p className="text-lg font-bold">{title}</p>
      </CardHeader>
      <CardBody className="items-center">
        <Form
          className="w-full items-center"
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          {children}
        </Form>
      </CardBody>
      <Divider className="my-7 md:my-3" />
      <CardFooter className="justify-center p-1 text-sm">{footer}</CardFooter>
    </Card>
  );
}
