import { expect } from 'vitest';
import { suite, test, onlyIfEnv, OnlyIfEnv as OnlyIfEnvSymbol } from '../src';

@suite('OnlyIfEnv Decorator - Suite Level')
@onlyIfEnv('TEST_RUN_SUITE', 'true')
class OnlyIfEnvSuiteLevelTest {
  @test('should run all tests when suite env matches')
  async shouldRunAllTests() {
    expect(process.env.TEST_RUN_SUITE).toBe('true');
  }

  @test('another test in suite with env')
  async anotherTest() {
    expect(1 + 1).toBe(2);
  }
}

@suite('OnlyIfEnv Decorator - Skip Suite')
@onlyIfEnv('NON_EXISTENT_SUITE_VAR', 'value')
class OnlyIfEnvSkipSuiteTest {
  @test('should be skipped because suite env does not match')
  async shouldBeSkipped() {
    expect(true).toBe(false);
  }

  @test('also should be skipped')
  async alsoSkipped() {
    expect(true).toBe(false);
  }
}

@suite('OnlyIfEnv Decorator - Multiple Env on Suite')
@onlyIfEnv('TEST_RUN_METHOD', 'true')
@onlyIfEnv('TEST_RUN_SUITE', 'true')
class OnlyIfEnvMultipleOnSuiteTest {
  @test('should run when all suite env conditions match')
  async shouldRunWhenAllMatch() {
    expect(process.env.TEST_RUN_METHOD).toBe('true');
    expect(process.env.TEST_RUN_SUITE).toBe('true');
  }
}

@suite('OnlyIfEnv Decorator - Method Level')
@onlyIfEnv('TEST_RUN_METHOD', 'true')
class OnlyIfEnvMethodLevelTest {
  @test('should run when suite env matches')
  async shouldRunWhenSuiteEnvMatches() {
    expect(process.env.TEST_RUN_METHOD).toBe('true');
  }

  @test('should also run with suite level env')
  async shouldAlsoRun() {
    expect(true).toBe(true);
  }
}

@suite('OnlyIfEnv Decorator - Metadata')
class OnlyIfEnvMetadataTest {
  @test('should store onlyIfEnv metadata on method')
  @onlyIfEnv('TEST_VAR', 'test_value')
  async shouldStoreMetadata() {
    const descriptor = Object.getOwnPropertyDescriptor(
      OnlyIfEnvMetadataTest.prototype,
      'shouldStoreMetadata',
    );
    const onlyIfEnvMeta = Reflect.getMetadata(OnlyIfEnvSymbol, descriptor!.value);
    expect(onlyIfEnvMeta).toEqual(['TEST_VAR', 'test_value']);
  }

  @test('should store multiple onlyIfEnv metadata on method')
  @onlyIfEnv('VAR1', 'value1')
  @onlyIfEnv('VAR2', 'value2')
  async shouldStoreMultipleMetadata() {
    const descriptor = Object.getOwnPropertyDescriptor(
      OnlyIfEnvMetadataTest.prototype,
      'shouldStoreMultipleMetadata',
    );
    const onlyIfEnvMeta = Reflect.getMetadata(OnlyIfEnvSymbol, descriptor!.value);
    expect(onlyIfEnvMeta).toEqual(['VAR2', 'value2']);
  }
}

@suite('OnlyIfEnv Decorator - CI Environment')
@onlyIfEnv('CI', 'true')
class CIOnlyIfEnvTest {
  @test('should run in CI environment')
  async shouldRunInCI() {
    expect(process.env.CI).toBe('true');
  }
}

@suite('OnlyIfEnv Decorator - Non-CI Environment')
@onlyIfEnv('CI', 'false')
class NonCIOnlyIfEnvTest {
  @test('should skip in non-CI environment')
  async shouldSkipInNonCI() {
    expect(true).toBe(false);
  }
}

@suite('OnlyIfEnv Decorator - Invalid Parameters')
class OnlyIfEnvInvalidParametersTest {
  @test('should throw error for empty variable name')
  async shouldThrowForEmptyVariableName() {
    expect(() => {
      onlyIfEnv('', 'value');
    }).toThrow();
  }

  @test('should throw error for empty expected value')
  async shouldThrowForEmptyExpectedValue() {
    expect(() => {
      onlyIfEnv('VAR_NAME', '');
    }).toThrow();
  }
}
