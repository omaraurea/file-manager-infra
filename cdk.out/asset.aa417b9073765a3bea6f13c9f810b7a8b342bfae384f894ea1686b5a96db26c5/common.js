"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceHandler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const aws = require("aws-sdk");
class ResourceHandler {
    constructor(eks, event) {
        this.eks = eks;
        this.requestType = event.RequestType;
        this.requestId = event.RequestId;
        this.logicalResourceId = event.LogicalResourceId;
        this.physicalResourceId = event.PhysicalResourceId;
        this.event = event;
        const roleToAssume = event.ResourceProperties.AssumeRoleArn;
        if (!roleToAssume) {
            throw new Error('AssumeRoleArn must be provided');
        }
        eks.configureAssumeRole({
            RoleArn: roleToAssume,
            RoleSessionName: `AWSCDK.EKSCluster.${this.requestType}.${this.requestId}`,
        });
    }
    onEvent() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
        const ProxyAgent = require('proxy-agent');
        aws.config.update({
            httpOptions: { agent: new ProxyAgent() },
        });
        switch (this.requestType) {
            case 'Create': return this.onCreate();
            case 'Update': return this.onUpdate();
            case 'Delete': return this.onDelete();
        }
        throw new Error(`Invalid request type ${this.requestType}`);
    }
    isComplete() {
        switch (this.requestType) {
            case 'Create': return this.isCreateComplete();
            case 'Update': return this.isUpdateComplete();
            case 'Delete': return this.isDeleteComplete();
        }
        throw new Error(`Invalid request type ${this.requestType}`);
    }
    log(x) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(x, undefined, 2));
    }
}
exports.ResourceHandler = ResourceHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLDZEQUE2RDtBQUM3RCwrQkFBK0I7QUFhL0IsTUFBc0IsZUFBZTtJQU9uQyxZQUErQixHQUFjLEVBQUUsS0FBb0I7UUFBcEMsUUFBRyxHQUFILEdBQUcsQ0FBVztRQUMzQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFJLEtBQWEsQ0FBQyxrQkFBa0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDO1FBQzVELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsR0FBRyxDQUFDLG1CQUFtQixDQUFDO1lBQ3RCLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLGVBQWUsRUFBRSxxQkFBcUIsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1NBQzNFLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxPQUFPO1FBQ1osb0dBQW9HO1FBQ3BHLE1BQU0sVUFBVSxHQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNoQixXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxVQUFVLEVBQUUsRUFBRTtTQUN6QyxDQUFDLENBQUM7UUFFSCxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDeEIsS0FBSyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QyxLQUFLLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RDLEtBQUssUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkM7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRU0sVUFBVTtRQUNmLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN4QixLQUFLLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDOUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLEtBQUssUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUMvQztRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFUyxHQUFHLENBQUMsQ0FBTTtRQUNsQixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBUUY7QUE5REQsMENBOERDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBhd3MgZnJvbSAnYXdzLXNkayc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWtzVXBkYXRlSWQge1xuICAvKipcbiAgICogSWYgdGhpcyBmaWVsZCBpcyBpbmNsdWRlZCBpbiBhbiBldmVudCBwYXNzZWQgdG8gXCJJc0NvbXBsZXRlXCIsIGl0IG1lYW5zIHdlXG4gICAqIGluaXRpYXRlZCBhbiBFS1MgdXBkYXRlIHRoYXQgc2hvdWxkIGJlIG1vbml0b3JlZCB1c2luZyBla3M6RGVzY3JpYmVVcGRhdGVcbiAgICogaW5zdGVhZCBvZiBqdXN0IGxvb2tpbmcgYXQgdGhlIGNsdXN0ZXIgc3RhdHVzLlxuICAgKi9cbiAgRWtzVXBkYXRlSWQ/OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgUmVzb3VyY2VFdmVudCA9IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQgJiBFa3NVcGRhdGVJZDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlSGFuZGxlciB7XG4gIHByb3RlY3RlZCByZWFkb25seSByZXF1ZXN0SWQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGxvZ2ljYWxSZXNvdXJjZUlkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSByZXF1ZXN0VHlwZTogJ0NyZWF0ZScgfCAnVXBkYXRlJyB8ICdEZWxldGUnO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXZlbnQ6IFJlc291cmNlRXZlbnQ7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHRoaXMucmVxdWVzdFR5cGUgPSBldmVudC5SZXF1ZXN0VHlwZTtcbiAgICB0aGlzLnJlcXVlc3RJZCA9IGV2ZW50LlJlcXVlc3RJZDtcbiAgICB0aGlzLmxvZ2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuTG9naWNhbFJlc291cmNlSWQ7XG4gICAgdGhpcy5waHlzaWNhbFJlc291cmNlSWQgPSAoZXZlbnQgYXMgYW55KS5QaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgY29uc3Qgcm9sZVRvQXNzdW1lID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFzc3VtZVJvbGVBcm47XG4gICAgaWYgKCFyb2xlVG9Bc3N1bWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXNzdW1lUm9sZUFybiBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgZWtzLmNvbmZpZ3VyZUFzc3VtZVJvbGUoe1xuICAgICAgUm9sZUFybjogcm9sZVRvQXNzdW1lLFxuICAgICAgUm9sZVNlc3Npb25OYW1lOiBgQVdTQ0RLLkVLU0NsdXN0ZXIuJHt0aGlzLnJlcXVlc3RUeXBlfS4ke3RoaXMucmVxdWVzdElkfWAsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25FdmVudCgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG4gICAgY29uc3QgUHJveHlBZ2VudDogYW55ID0gcmVxdWlyZSgncHJveHktYWdlbnQnKTtcbiAgICBhd3MuY29uZmlnLnVwZGF0ZSh7XG4gICAgICBodHRwT3B0aW9uczogeyBhZ2VudDogbmV3IFByb3h5QWdlbnQoKSB9LFxuICAgIH0pO1xuXG4gICAgc3dpdGNoICh0aGlzLnJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOiByZXR1cm4gdGhpcy5vbkNyZWF0ZSgpO1xuICAgICAgY2FzZSAnVXBkYXRlJzogcmV0dXJuIHRoaXMub25VcGRhdGUoKTtcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6IHJldHVybiB0aGlzLm9uRGVsZXRlKCk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJlcXVlc3QgdHlwZSAke3RoaXMucmVxdWVzdFR5cGV9YCk7XG4gIH1cblxuICBwdWJsaWMgaXNDb21wbGV0ZSgpIHtcbiAgICBzd2l0Y2ggKHRoaXMucmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6IHJldHVybiB0aGlzLmlzQ3JlYXRlQ29tcGxldGUoKTtcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6IHJldHVybiB0aGlzLmlzVXBkYXRlQ29tcGxldGUoKTtcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6IHJldHVybiB0aGlzLmlzRGVsZXRlQ29tcGxldGUoKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVxdWVzdCB0eXBlICR7dGhpcy5yZXF1ZXN0VHlwZX1gKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBsb2coeDogYW55KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh4LCB1bmRlZmluZWQsIDIpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBvbkNyZWF0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBvbkRlbGV0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZSB8IHZvaWQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgb25VcGRhdGUoKTogUHJvbWlzZTwoT25FdmVudFJlc3BvbnNlICYgRWtzVXBkYXRlSWQpIHwgdm9pZD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBpc0NyZWF0ZUNvbXBsZXRlKCk6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGlzRGVsZXRlQ29tcGxldGUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaXNVcGRhdGVDb21wbGV0ZSgpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWtzQ2xpZW50IHtcbiAgY29uZmlndXJlQXNzdW1lUm9sZShyZXF1ZXN0OiBhd3MuU1RTLkFzc3VtZVJvbGVSZXF1ZXN0KTogdm9pZDtcbiAgY3JlYXRlQ2x1c3RlcihyZXF1ZXN0OiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXNwb25zZT47XG4gIGRlbGV0ZUNsdXN0ZXIocmVxdWVzdDogYXdzLkVLUy5EZWxldGVDbHVzdGVyUmVxdWVzdCk6IFByb21pc2U8YXdzLkVLUy5EZWxldGVDbHVzdGVyUmVzcG9uc2U+O1xuICBkZXNjcmliZUNsdXN0ZXIocmVxdWVzdDogYXdzLkVLUy5EZXNjcmliZUNsdXN0ZXJSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLkRlc2NyaWJlQ2x1c3RlclJlc3BvbnNlPjtcbiAgdXBkYXRlQ2x1c3RlckNvbmZpZyhyZXF1ZXN0OiBhd3MuRUtTLlVwZGF0ZUNsdXN0ZXJDb25maWdSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLlVwZGF0ZUNsdXN0ZXJDb25maWdSZXNwb25zZT47XG4gIHVwZGF0ZUNsdXN0ZXJWZXJzaW9uKHJlcXVlc3Q6IGF3cy5FS1MuVXBkYXRlQ2x1c3RlclZlcnNpb25SZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLlVwZGF0ZUNsdXN0ZXJWZXJzaW9uUmVzcG9uc2U+O1xuICBkZXNjcmliZVVwZGF0ZShyZXE6IGF3cy5FS1MuRGVzY3JpYmVVcGRhdGVSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLkRlc2NyaWJlVXBkYXRlUmVzcG9uc2U+O1xuICBjcmVhdGVGYXJnYXRlUHJvZmlsZShyZXF1ZXN0OiBhd3MuRUtTLkNyZWF0ZUZhcmdhdGVQcm9maWxlUmVxdWVzdCk6IFByb21pc2U8YXdzLkVLUy5DcmVhdGVGYXJnYXRlUHJvZmlsZVJlc3BvbnNlPjtcbiAgZGVzY3JpYmVGYXJnYXRlUHJvZmlsZShyZXF1ZXN0OiBhd3MuRUtTLkRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLkRlc2NyaWJlRmFyZ2F0ZVByb2ZpbGVSZXNwb25zZT47XG4gIGRlbGV0ZUZhcmdhdGVQcm9maWxlKHJlcXVlc3Q6IGF3cy5FS1MuRGVsZXRlRmFyZ2F0ZVByb2ZpbGVSZXF1ZXN0KTogUHJvbWlzZTxhd3MuRUtTLkRlbGV0ZUZhcmdhdGVQcm9maWxlUmVzcG9uc2U+O1xufVxuIl19