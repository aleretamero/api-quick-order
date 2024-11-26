import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiResponseOptions,
  ApiTags,
  ApiHeaders,
  ApiBodyOptions,
  ApiHeaderOptions,
  ApiOperationOptions,
  ApiBody,
  ApiOperation,
  ApiConsumes,
  ApiHeader,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class ApiErrorSchema {
  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  errors?: string[];

  @ApiProperty()
  statusCode!: number;
}

type ApiDocsOptions = {
  tags?: string | string[];
  options?: ApiOperationOptions;
  consumes?: string | string[];
  headers?: ApiHeaderOptions[];
  body?: ApiBodyOptions;
  isPublic?: boolean;
  acceptLanguage?: boolean;
  response?: (ApiResponseOptions | number)[];
};

export function ApiDocs(options?: ApiDocsOptions) {
  const decorators: (MethodDecorator | ClassDecorator)[] = [];

  if (options?.tags) {
    decorators.push(
      ApiTags(...(Array.isArray(options.tags) ? options.tags : [options.tags])),
    );
  }

  if (options?.options) {
    decorators.push(ApiOperation(options.options));
  }

  if (options?.consumes) {
    decorators.push(
      ApiConsumes(...(Array.isArray(options.consumes) ? options.consumes : [options.consumes])), // prettier-ignore
    );
  }

  if (options?.headers) {
    decorators.push(ApiHeaders(options.headers));
  }

  if (options?.body) {
    decorators.push(ApiBody(options.body));
  }

  if (options?.isPublic === undefined || !options?.isPublic) {
    decorators.push(
      ApiBearerAuth(),
      ApiHeader({ name: 'x-fingerprint', required: true }),
    );
  }

  if (options?.acceptLanguage === undefined || options?.acceptLanguage) {
    decorators.push(
      ApiHeader({
        name: 'accept-language',
        required: false,
        enum: ['pt', 'en', 'es'],
      }),
    );
  }

  if (!options?.response) {
    options = { response: [] };
  }

  const responseStatus = options.response!.map((response) => {
    if (typeof response === 'number') {
      return {
        status: response,
        type: ApiErrorSchema,
      };
    }

    return response;
  });

  for (const response of responseStatus) {
    decorators.push(ApiResponse(response));
  }

  return applyDecorators(...decorators);
}
