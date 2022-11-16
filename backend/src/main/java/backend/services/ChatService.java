package backend.services;

import backend.common.FriendStatuses;
import backend.data.dto.chat.MessagePayLoad;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.mapper.MessageMapper;
import backend.repositories.MessageRepository;
import backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;

@Service
@AllArgsConstructor
public class ChatService {
    private final MessageMapper mapper;
    private final MessageRepository messageRepository;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public void sendPrivateMessage(MessagePayLoad messagePayLoad) throws NoPermissionException {
//        String status = userService.getFriendStatusResult(messagePayLoad.getReceiver());
//        if(!status.equals(FriendStatuses.FRIEND.getStatus())){
//            throw new NoPermissionException("You are not friend");
//        }
        messageRepository.save(mapper.fromMessagePayloadToMessages(messagePayLoad));
        simpMessagingTemplate.convertAndSend("/topic/messages/" + messagePayLoad.getReceiver(),messagePayLoad);
    }

    public BaseResponse getMessages(PagingRequest pagingRequest, String friendId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        String status = userService.getFriendStatusResult(friendId);

        if(!status.equals(FriendStatuses.FRIEND.getStatus())){
            throw new NoPermissionException("You are not friend");
        }

        return BaseResponse.builder().message("Get messages successful.")
                .data(new PagingResponse(messageRepository
                        .queryMessageByUserIdAndFriendId(PagingUtils.getPageable(pagingRequest),userId,friendId)
                        .map(mapper::fromMessagesToMessagePayload)))
                .build();
    }
}
