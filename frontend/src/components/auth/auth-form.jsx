import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Form} from "@heroui/form";
import {Divider} from "@heroui/divider";

export default function AuthForm({title, children, footer, onSubmit, errors}) {
  return (
    <Card className="p-7 lg:min-w-[450px] h-fit mb-[4rem]">
      <CardHeader className="justify-center">
        <p className="text-lg font-bold">{title}</p>
      </CardHeader>
      <CardBody className="items-center">
        <Form className="w-full items-center" onSubmit={onSubmit} validationErrors={errors}>
          {children}
        </Form>
      </CardBody>
      <Divider className="my-3"/>
      <CardFooter className="justify-center p-1 text-sm">
        {footer}
      </CardFooter>
    </Card>
  );
}
