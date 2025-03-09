import "@testing-library/jest-dom";
import AxiosMockAdapter from "axios-mock-adapter";
import axiosInstance from "@/lib/api/axiosClient";

// Khởi tạo Axios Mock Adapter
export const mockAxios = new AxiosMockAdapter(axiosInstance);

// Reset mock sau mỗi test
afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
});


// Mock console.error để test dễ đọc hơn
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
